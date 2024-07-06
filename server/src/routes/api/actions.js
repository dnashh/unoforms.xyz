import express from "express";
import ActionTriggers from "../../models/ActionTriggers.js";
import bp from "../../utils/bigPromise.js";
import { FormAccessControl } from "../../config/middlewares.js";
const router = express.Router();

router.post(
  "/:id",
  FormAccessControl,
  bp(async (req, res) => {
    const data = req.body;
    const action = await ActionTriggers.create(data);
    res.status(201).json({ action });
  })
);

router.post(
  "/:id/edit/:actionid",
  FormAccessControl,
  bp(async (req, res) => {
    const { actionid } = req.params;
    const { variables } = req.body;
    console.log(req.body, req.params);
    const action = await ActionTriggers.findByPk(actionid);
    if (!action) {
      res.status(404).json({ message: "Action Doesn't Exist" });
      return;
    }
    action.variables = variables;
    await action.save();
    res.status(201).json({ action, message: "Action Edited Successfully" });
  })
);

router.post(
  "/:id/delete/:actionId",
  FormAccessControl,
  bp(async (req, res) => {
    const { actionId } = req.params;
    const action = await ActionTriggers.findByPk(actionId);
    await action.destroy();
    res.status(200).json({ message: "Row Deleted Successfully" });
  })
);

export default router;
