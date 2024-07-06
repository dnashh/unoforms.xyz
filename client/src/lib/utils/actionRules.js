export const TriggerEmailOnSubmit = {
    id: 1,
    name: "Trigger Email on Submit",
    description: "Trigger Emails when someone submits a form response",
    icon: "M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44Zm-96,83.72L62.85,68h130.3ZM92.79,128,44,172.72V83.28Zm17.76,16.28,9.34,8.57a12,12,0,0,0,16.22,0l9.34-8.57L193.15,188H62.85ZM163.21,128,212,83.28v89.44Z",
    trigger_type: ["auto", "manual"],
    required_variables: ["Action Name", "sendTo", "from", "subject", "template", "EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS"]
}

export default [TriggerEmailOnSubmit]