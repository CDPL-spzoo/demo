import com.codeborne.selenide.Condition;
import io.automation.selenide.Page;
import io.cucumber.java.en.And;
import io.cucumber.java.en.When;

import java.time.Duration;

public class AddInvoicePopUpSteps {

    @And("user see add invoice pop up")
    public void userSeeAddInvoicePopUp() {
        Page.assertCondition(AddInvoicePopUP.POPUP_HEADER, Condition.appear, Duration.ofSeconds(10));
    }

    @And("user click on submit button without pricing on add invoice pop up")
    public void userClickOnSubmitButtonWithoutPricingOnAddInvoicePopUp() {
        Page.at(AddInvoicePopUP.class).clickWhenEnabled(AddInvoicePopUP.SUBMIT_BUTTON);
    }

    @And("user provide debit invoice number for credit invoice")
    public void userProvideDebitInvoiceNumberForCreditInvoice() {
        Page.at(AddInvoicePopUP.class).selectParentInvoice();
    }

    @And("user see Article details field with tag button")
    public void userSeeArticleDetailsFieldWithTagButton() {
        Page.assertCondition(AddInvoicePopUP.ARTICLE_DETAILS_FIELD, Condition.appear, Duration.ofSeconds(10));
        Page.assertCondition(AddInvoicePopUP.ARTICLE_TAG_BUTTON, Condition.appear, Duration.ofSeconds(10));
    }

    @When("user click on tag button field")
    public void userClickOnTagButtonField() {
        Page.at(AddInvoicePopUP.class).clickWhenEnabled(AddInvoicePopUP.ARTICLE_TAG_BUTTON);
    }


    @And("user can not create an invoice if article field blank")
    public void userCanNotCreateAnInvoiceIfArticleFieldBlank() {
        Page.assertCondition(AddInvoicePopUP.POPUP_HEADER, Condition.appear, Duration.ofSeconds(10));
    }
}
