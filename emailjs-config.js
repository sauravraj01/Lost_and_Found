/**
 * EmailJS setup (free account at https://www.emailjs.com/)
 *
 * 1. Create an EmailJS account
 * 2. Add an Email Service (Gmail / Outlook / etc.)
 * 3. Create a template with these variables:
 *      {{to_email}}   {{to_name}}   {{item_name}}
 *      {{found_by}}   {{found_description}}   {{message}}
 *    Set "To Email" in the template to {{to_email}}
 * 4. Paste your keys below
 */
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "YOUR_PUBLIC_KEY",
    SERVICE_ID: "YOUR_SERVICE_ID",
    TEMPLATE_ID: "YOUR_TEMPLATE_ID"
};
