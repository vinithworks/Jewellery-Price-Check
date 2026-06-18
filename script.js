//alert("JS Loaded");
// ==============================
// PAGE NAVIGATION
// ==============================

const startBtn = document.getElementById("startBtn");
const welcomePage = document.getElementById("welcomePage");
const calculatorPage = document.getElementById("calculatorPage");

startBtn.addEventListener("click", () => {
    welcomePage.classList.add("hidden");
    calculatorPage.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ==============================
// DYNAMIC RATE FIELDS
// ==============================

const jewelleryTypes =
    document.querySelectorAll(".jewelleryType");

const rateBoxes = {
    Gold: document.getElementById("goldRateBox"),
    Silver: document.getElementById("silverRateBox"),
    "Gift Articles": document.getElementById("giftRateBox"),
    Diamond: document.getElementById("diamondRateBox"),
    Platinum: document.getElementById("platinumRateBox")
};

jewelleryTypes.forEach(type => {

    type.addEventListener("change", () => {

        Object.keys(rateBoxes).forEach(key => {

            const checkbox =
                [...jewelleryTypes].find(
                    cb => cb.value === key
                );

            if (checkbox.checked) {
                rateBoxes[key].classList.remove("hidden");
            } else {
                rateBoxes[key].classList.add("hidden");
            }
        });

    });

});

// ==============================
// CALCULATE
// ==============================

const calculateBtn =
    document.getElementById("calculateBtn");

const pdfBtn =
    document.getElementById("pdfBtn");

const errorBox =
    document.getElementById("errorBox");

const resultSection =
    document.getElementById("resultSection");

const breakdown =
    document.getElementById("calculationBreakdown");

const verification =
    document.getElementById("verificationResult");

let finalResultData = {};

calculateBtn.addEventListener(
    "click",
    calculateAndVerify
);

function calculateAndVerify() {

    errorBox.classList.add("hidden");

    const selectedTypes =
        [...jewelleryTypes]
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const gst =
        document.getElementById("gst").value;

    const weight =
        parseFloat(
            document.getElementById("weight").value
        );

    if (
        selectedTypes.length === 0 ||
        !gst ||
        !weight
    ) {
        errorBox.classList.remove("hidden");
        return;
    }

    // =========================
    // GET RATE
    // =========================

    let totalBaseAmount = 0;

    selectedTypes.forEach(type => {

        let rate = 0;

        if (type === "Gold")
            rate = Number(
                document.getElementById("goldRate").value
            );

        if (type === "Silver")
            rate = Number(
                document.getElementById("silverRate").value
            );

        if (type === "Gift Articles")
            rate = Number(
                document.getElementById("giftRate").value
            );

        if (type === "Diamond")
            rate = Number(
                document.getElementById("diamondRate").value
            );

        if (type === "Platinum")
            rate = Number(
                document.getElementById("platinumRate").value
            );

        totalBaseAmount += rate * weight;
    });

    // =========================
    // OPTIONAL VALUES
    // =========================

    const wastagePercent =
        Number(
            document.getElementById("wastage").value
        ) || 0;

    const makingCharges =
        Number(
            document.getElementById("makingCharges").value
        ) || 0;

    const stoneCharges =
        Number(
            document.getElementById("stoneCharges").value
        ) || 0;

    const scheme =
        Number(
            document.getElementById("scheme").value
        ) || 0;

    const discount =
        Number(
            document.getElementById("discount").value
        ) || 0;

    const offer =
        Number(
            document.getElementById("offer").value
        ) || 0;

    const additionalCharges =
        Number(
            document.getElementById("additionalCharges").value
        ) || 0;

    const shopAmount =
        Number(
            document.getElementById("shopAmount").value
        ) || 0;

    // =========================
    // CALCULATIONS
    // =========================

    const wastageAmount =
        (totalBaseAmount * wastagePercent) / 100;

    const beforeGST =
        totalBaseAmount +
        wastageAmount +
        makingCharges +
        stoneCharges +
        additionalCharges -
        scheme -
        discount -
        offer;

    const gstAmount =
        (beforeGST * Number(gst)) / 100;

    const finalAmount =
        beforeGST + gstAmount;

    // =========================
    // RESULT UI
    // =========================

    breakdown.innerHTML = `

    <div class="result-row">
        <span>Base Amount</span>
        <span>₹ ${totalBaseAmount.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>Wastage Amount</span>
        <span>₹ ${wastageAmount.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>Making Charges</span>
        <span>₹ ${makingCharges.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>Stone Charges</span>
        <span>₹ ${stoneCharges.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>Additional Charges</span>
        <span>₹ ${additionalCharges.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>Scheme Deduction</span>
        <span>- ₹ ${scheme.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>Discount</span>
        <span>- ₹ ${discount.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>Special Offer</span>
        <span>- ₹ ${offer.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>Total Before GST</span>
        <span>₹ ${beforeGST.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span>GST (${gst}%)</span>
        <span>₹ ${gstAmount.toFixed(2)}</span>
    </div>

    <div class="result-row">
        <span><b>Final Payable Amount</b></span>
        <span><b>₹ ${finalAmount.toFixed(2)}</b></span>
    </div>
    `;

    // =========================
    // VERIFICATION
    // =========================

    let verifyText = "";

    if (shopAmount > 0) {

        const difference =
            Math.abs(
                finalAmount - shopAmount
            );

        let status = "";
        let cssClass = "";

        if (difference <= 10) {
            status = "Amount Matches";
            cssClass = "match";
        }
        else if (difference <= 500) {
            status = "Minor Difference Found";
            cssClass = "minor";
        }
        else {
            status =
                "Significant Difference Found";
            cssClass = "significant";
        }

        verifyText = `
        <h3>Verification Result</h3>

        <p>
        Application Amount :
        ₹ ${finalAmount.toFixed(2)}
        </p>

        <p>
        Shop Amount :
        ₹ ${shopAmount.toFixed(2)}
        </p>

        <p>
        Difference :
        ₹ ${difference.toFixed(2)}
        </p>

        <p class="${cssClass}">
        ${status}
        </p>
        `;
    }

    verification.innerHTML = verifyText;

    resultSection.classList.remove("hidden");

    pdfBtn.classList.remove("hidden");

    finalResultData = {
        totalBaseAmount,
        wastageAmount,
        makingCharges,
        stoneCharges,
        additionalCharges,
        scheme,
        discount,
        offer,
        beforeGST,
        gst,
        gstAmount,
        finalAmount,
        shopAmount
    };

}

// ==============================
// PDF GENERATION
// ==============================

pdfBtn.addEventListener(
    "click",
    generatePDF
);
    
function generatePDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
	
	const logo = new Image();
    logo.src = "logo.png";


    const now = new Date();

    let y = 20;

    doc.setFontSize(20);

    doc.text(
        "Jewellery Price Check Report",
        20,
        y
    );

    y += 15;

    doc.setFontSize(11);

    doc.text(
        `Date : ${now.toLocaleDateString()}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `Time : ${now.toLocaleTimeString()}`,
        20,
        y
    );
	
	y += 15;

doc.text(
    `Weight (Grams) : ${document.getElementById("weight").value}`,
    20,
    y
);

y += 8;

const rate =
    document.getElementById("goldRate")?.value ||
    document.getElementById("silverRate")?.value ||
    document.getElementById("giftRate")?.value ||
    document.getElementById("diamondRate")?.value ||
    document.getElementById("platinumRate")?.value ||
    "0";

doc.text(
    `Rate Per Gram : Rs. ${rate}`,
    20,
    y
);

y += 12;

    y += 15;

    doc.text(
        `Base Amount : Rs. ${finalResultData.totalBaseAmount.toFixed(2)}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `Wastage Amount : Rs. ${finalResultData.wastageAmount.toFixed(2)}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `Making Charges : Rs. ${finalResultData.makingCharges.toFixed(2)}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `Stone Charges : Rs. ${finalResultData.stoneCharges.toFixed(2)}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `Additional Charges : Rs. ${finalResultData.additionalCharges.toFixed(2)}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `Scheme Deduction : Rs. ${finalResultData.scheme.toFixed(2)}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `Discount : Rs. ${finalResultData.discount.toFixed(2)}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `Special Offer : Rs. ${finalResultData.offer.toFixed(2)}`,
        20,
        y
    );

    y += 8;

    doc.text(
        `GST (${finalResultData.gst}%) : Rs. ${finalResultData.gstAmount.toFixed(2)}`,
        20,
        y
    );

    y += 12;

    doc.setFontSize(14);

    doc.text(
        `Final Amount : Rs. ${finalResultData.finalAmount.toFixed(2)}`,
        20,
        y
    );

logo.onload = function () {

    doc.addImage(
        logo,
        "PNG",
        165,
        10,
        25,
        25
    );

    doc.save(
        `Jewellery-Price-Report-${Date.now()}.pdf`
    );

};

}

    