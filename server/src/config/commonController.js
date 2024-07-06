import { nanoid } from 'nanoid';
import FormData from '../models/formDataModel.js';
import Forms from '../models/formModel.js';
import formResponse from '../models/formResponse.js';
import bp from '../utils/bigPromise.js';
import { sequelize } from './database.js';
import { activityLogger } from '../utils/functions.js';
import { triggerActions } from './functions.js';


const SUCCESS_URL = "https://unoforms.xyz/response/success/";
const FAILED_URL = "https://unoforms.xyz/response/failed/";

export const submitFormData = bp(async (req, res) => {
    const formId = req.params.id;
    const form = await Forms.findByPk(formId);
    const sendJSON = req.headers["accept"] == "application/json";
    if(!form){
        sendJSON ? res.status(404).json({ message: "Form Doesn't Exist", status: "not found" }) :
            res.redirect(`${form.redirectTo || FAILED_URL}?status=not-found&code=404`);
        return;
    }
    if(!form.isPublic && req.baseUrl != '/api/forms' ){
        sendJSON ? res.status(400).json({ message: "Form is Closed. Contact Owner", status: "closed" }) : 
            res.redirect(`${form.redirectTo || FAILED_URL}?status=closed&code=400`);
        return;
    }
    const data = req.body;
    if(!form.allowDuplicates) {
        const pKeys = form.primaryKeys;
        for (const key of pKeys) {
            const alreadyExists = await formResponse.findOne({ where: { key: key.replaceAll(" ", "_"), value: data[key] || '', formId: form?.id || '' } });
            if(alreadyExists){
                console.log(alreadyExists);
                sendJSON ? res.status(400).json({ message: "Primary Key Value already exists", status: "duplicate" }) : 
                    res.redirect(`${form.redirectTo || FAILED_URL}?status=duplicate&code=400`);
                return;
            }
        }
    }
    await sequelize.transaction(async (transaction) => {
        try {
            const formData = await FormData.create({ id: nanoid(10), formId }, { transaction });
            const keys = Object.keys(data);
            const successful = [];
            for (const key of keys) {
                const success = await formResponse.create({ 
                    responseId: formData.id,
                    formId: form.id,
                    key: key.replaceAll(" ", "_"),
                    value: data[key].toString(),
                    type: typeof(data[key]) 
                }, { transaction });
                successful.push(success);
            }
            form.changed('updatedAt', true);
            await form.update({ updatedAt: new Date() }, { transaction });
            sendJSON ? res.status(200).json({ message: "Form Submitted Successfully", status: "success" }) :
                res.redirect(`${form.redirectTo || SUCCESS_URL}?status=success&code=200`);
            triggerActions(form, data, formData.id);
            activityLogger('form-submit', 'anonymous', req.ip, { id: form.id });
        } catch (err) {
            console.error(err);
            sendJSON ? res.status(500).json({ message: "some error occured, cannot submit form", status: "failed" }) :
                res.redirect(`${form.redirectTo || FAILED_URL}?status=failed&code=500`);
        }
    });
});