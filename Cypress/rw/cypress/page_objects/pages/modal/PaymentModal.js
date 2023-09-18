import BasePage from "../../BasePage";

const methodNameSelector = 'form > div > div > div >  div:nth-child(2) div';
//0, 1, 2 - Bank Card, 3, 4 - Crypto
const paymentMethodsSelector = '#paymentMethod span:nth-child(2) h3';
const baseIframe = 'iframe[title="modal-iframe"]';
const fpfIframe = '[title="fpf-iframe"]';
const payButton = "[type='submit']";
const otpField = "input#otp";
const cardNumberField = '#pci-dss-form_number';
const cardMonthYearField = '#pci-dss-form_expiry';
const cardCVCField = '#pci-dss-form_cvc';
const submitButton = '#submit_btn';
const beneficiaryFirstNameField = '#to_first_name';
const beneficiaryLastNameField = '#to_last_name';
const pixKeyField = '#to_id_details_pix';
const cpfNumberField = '#to_id_details_cpf';
const receiveButton = '[type="submit"]';
const bankIsRequiredErrorMessage = "[class$='explain-error']";
const amountField = '#customer_amount';

//prod
const cryptoModalMessage = "p[class='time']";
const cryptoExpectedAmountField = "div[class='value']";

export default class PaymentModal extends BasePage {

    getBaseIframe = () => cy.get(baseIframe, {log: false});
    getModalCloseButton = () => cy.get("[class^='style__Close-sc']", {log: false});

    getBaseModalFieldBySelector = (selector) => {
        return this.getBaseIframe()
            .its('0.contentDocument')
            .its('body')
            .find(selector);
    }

    getFpfModalFieldBySelector = (selector) => {
        return this.getBaseModalFieldBySelector(fpfIframe)
            .its('0.contentDocument')
            .its('body')
            .find(selector);
    }

    clickOnBankCardByIndex(index) {
        this.getBaseModalFieldBySelector(`${paymentMethodsSelector}:eq(${index})`).click()
        this.getBaseModalFieldBySelector(methodNameSelector).should('have.text', 'Card details')
        this.getBaseModalFieldBySelector(payButton).click()
        return this
    }

    fillCardDetails() {
        this.getFpfModalFieldBySelector(cardNumberField).type('4104290687925390')
        this.getFpfModalFieldBySelector(cardMonthYearField).type("12/31")
        this.getFpfModalFieldBySelector(cardCVCField).type("123")
        this.getFpfModalFieldBySelector(payButton).click();
        this.getFpfModalFieldBySelector(otpField).type('1234');
        this.getFpfModalFieldBySelector(submitButton).click();
        return this
    }

    fillWithdrawCredentials() {
        this.getBaseModalFieldBySelector(beneficiaryFirstNameField).type('Test')
        this.getBaseModalFieldBySelector(beneficiaryLastNameField).type('Test')
        this.getBaseModalFieldBySelector(pixKeyField).type('pix@test.key')
        this.getBaseModalFieldBySelector(cpfNumberField).type('502.844.147-27')
        this.getBaseModalFieldBySelector(receiveButton).click()
        cy.waitForLoader(10000)
        return this;
    }

    closePaymentModal() {
        this.getModalCloseButton().should("be.visible").click()
        return this
    }

    verifyDepositModalDisplayed(amount) {
        this.getBaseModalFieldBySelector(amountField).should("have.value", `$${amount}`)
        return this
    }

    verifyBankAccountAndCryptoDisplayed() {
        this.getBaseModalFieldBySelector(`${paymentMethodsSelector}:eq(${0})`).should("be.visible")
        this.getBaseModalFieldBySelector(`${paymentMethodsSelector}:eq(${0})`).should("have.text", 'bank account')
        this.getBaseModalFieldBySelector(`${paymentMethodsSelector}:eq(${1})`).should("be.visible")
        this.getBaseModalFieldBySelector(`${paymentMethodsSelector}:eq(${1})`).should("have.text", 'crypto')
        return this
    }

    verifyChangingPaymentMethods() {
        this.getBaseModalFieldBySelector(paymentMethodsSelector).eq(0).click()
        this.getBaseModalFieldBySelector(paymentMethodsSelector).eq(0).should("have.text", "bank account")
        this.getBaseModalFieldBySelector(paymentMethodsSelector).eq(1).click()
        this.getBaseModalFieldBySelector(paymentMethodsSelector).eq(1).should("have.text", "crypto")
        return this
    }

    verifyBankAccountRequiredErrorMessage() {
        this.getBaseModalFieldBySelector(paymentMethodsSelector).eq(0).click()
        this.getBaseModalFieldBySelector(payButton).click()
        this.getBaseModalFieldBySelector(bankIsRequiredErrorMessage).should("have.text", "Field is required")
        return this
    }

    verifyCryptoDetailsUIElements(amount) {
        this.getBaseModalFieldBySelector(paymentMethodsSelector).eq(1).click()
        this.getBaseModalFieldBySelector(payButton).click()
        this.getFpfModalFieldBySelector(cryptoModalMessage).should("have.text", "It may take about 5 minutes")
        this.getFpfModalFieldBySelector(cryptoExpectedAmountField).should("contain.text", `${amount} USDT`)
        return this
    }
}