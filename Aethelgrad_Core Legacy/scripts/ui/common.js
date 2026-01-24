import { ActionFormData, MessageFormData } from "@minecraft/server-ui";

/**
 * Creates a standard action form
 * @param {string} title 
 * @param {string} body 
 * @returns {ActionFormData}
 */
export function createActionForm(title, body) {
    return new ActionFormData().title(title).body(body);
}

/**
 * Creates a standard confirmation (message) form
 * @param {string} title 
 * @param {string} body 
 * @param {string} btn1 
 * @param {string} btn2 
 * @returns {MessageFormData}
 */
export function createConfirmForm(title, body, btn1 = "Yes", btn2 = "No") {
    return new MessageFormData().title(title).body(body).button1(btn1).button2(btn2);
}