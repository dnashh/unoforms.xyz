import express from "express";
import { submitFormData } from "../../config/commonController.js";
import { FormAccessControl } from "../../config/middlewares.js";
import { logger } from "../../utils/winston.js";
import FormData from "../../models/formDataModel.js";
import Forms from "../../models/formModel.js";
import bp from "../../utils/bigPromise.js";
import { sequelize } from "../../config/database.js";
import formResponse from "../../models/formResponse.js";
import { nanoid } from "nanoid";
import { issueDownload } from "../../config/functions.js";
import ActionTriggers from "../../models/ActionTriggers.js";
import { Op } from "sequelize";

const router = express.Router();

router.get(
  "/",
  bp(async (req, res) => {
    const forms = await Forms.findAll({
      where: {
        [Op.or]: [
          { sharedTo: { [Op.contains]: [req.user.email] } },
          { owner: req.user.id },
        ],
      },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ forms });
  })
);

router.post(
  "/create",
  bp(async (req, res) => {
    const data = req.body;
    data.owner = req.user.id;
    data.id = nanoid(11);
    const form = await Forms.create(data);
    res.status(201).json({ form, message: "New Form Created Successfully" });
    logger.info(`new-form-created #${form.id} by ${req.user.id}`);
  })
);

router.put(
  "/update/:id",
  FormAccessControl,
  bp(async (req, res) => {
    const id = req.params.id;
    const {
      title,
      isPublic,
      redirectTo,
      allowDuplicates,
      primaryKeys,
      sharedTo,
    } = req.body;
    await Forms.update(
      { title, isPublic, redirectTo, allowDuplicates, primaryKeys, sharedTo },
      { where: { id } }
    );
    const form = await Forms.findByPk(id);
    res.status(201).json({ form, message: "Form Updated Successfully" });
    logger.info(`form-updated #${form.id} by ${req.user.id}`);
  })
);

router.get(
  "/:id",
  FormAccessControl,
  bp(async (req, res) => {
    const { download } = req.query;
    const id = req.params.id;
    const form = await (await Forms.findByPk(id)).toJSON();
    const formData = await FormData.findAll({
      where: { formId: form.id },
      include: ["responses"],
      order: [["updatedAt", "DESC"]],
    });
    const actions = await ActionTriggers.findAll({ where: { form: id } });
    form["formData"] = formData;
    form["actions"] = actions;
    if (download) {
      issueDownload(JSON.parse(JSON.stringify(form)), (csv) => {
        if (csv) {
          res.header("Content-Type", "text/csv");
          res.attachment(JSON.parse(JSON.stringify(form))["title"] + ".csv");
          res.send(csv);
        } else {
          res.status(500).json({ error: 500, message: "Some Error Occured" });
        }
      });
    } else {
      res.status(200).json({ form });
    }
  })
);

// Modify Data Routes Below.
// TODO: Implement Access Privelages to modify Data

router.post(
  "/delete/data/:id",
  bp(async (req, res) => {
    const id = req.params.id;
    const formData = await FormData.findByPk(id, { include: ["responses"] });
    // Check Here if user has permissions for the form.
    const bulkDelete = formData.responses.map((row) => {
      return row.id;
    });
    await sequelize.transaction(async (transaction) => {
      try {
        await formResponse.destroy({ where: { id: bulkDelete }, transaction });
        await formData.destroy({ where: id, transaction });
        res.status(200).json({ message: "Successfully Deleted Responses " });
      } catch (err) {
        logger.warning(err);
        res
          .status(500)
          .json({ err, message: "An Error Occured. Try Again Later" });
      }
    });
  })
);

router.get("/create/:id", (req, res) => {
  res.status(400).json({
    message: "GET Method Not Allowed. Use POST Method to Submit Data",
  });
});

router.post("/create/:id", submitFormData);

export default router;
