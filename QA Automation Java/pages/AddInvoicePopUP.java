import com.codeborne.selenide.SelenideElement;
import org.assertj.core.api.AbstractPathAssert;
import org.openqa.selenium.By;

import static com.codeborne.selenide.Selenide.$x;

public class AddInvoicePopUP extends AbstractPage implements BasePage {

    public static SelenideElement POPUP_HEADER = $x("//h4");
    public static SelenideElement SUBMIT_BUTTON = $x("//button[@type='submit']");
    public static SelenideElement PARENT_INVOICE_FIELD = $x("//span[@tabindex='-1']");
    public static SelenideElement PARENT_INVOICE_INPUT = $x("//input[@tabindex='-1']");
    public static SelenideElement ARTICLE_DETAILS_FIELD = $x("//table[contains(@class, 'table-invoice-items')]//th");
    public static SelenideElement ARTICLE_TAG_BUTTON = $x("//button[@ng-click='addInvoiceItem()']");
    public static SelenideElement ARTICLE_FIELD = $x("//span[@tabindex='-1']");
    public static SelenideElement ARTICLE_INPUT_FIELD = $x("//input[@tabindex='-1']");

    public AddCarsharingInvoicePopUp selectParentInvoice() {
        scrollIntoView(PARENT_INVOICE_FIELD);
        clickJS(PARENT_INVOICE_FIELD);
        sendKeysDelay(PARENT_INVOICE_INPUT, UserProfilePage.ALL_INVOICE_LIST.get(0));
        clickJS(findElementByTillNotNull(By.xpath("//*[@id='ui-select-choices-row-3-0']")));
        return this;
    }
}
