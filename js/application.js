const today = new Date().toISOString().slice(0, 10)

//retrieve elements

let applicantfName = document.getElementById("firstName");

let applicantlName = document.getElementById("lastName");

let balance = document.getElementById("balance");

let history = document.getElementById("history")

// set max day to current date
let lastDeposit = document.getElementById("last-deposit")
lastDeposit.setAttribute('max', `${today}`)

let lastLoan = document.getElementById("last-loan")
lastLoan.setAttribute('max', `${today}`)

//set min day to current date
let loanRequest = document.getElementById("loanRequest")
loanRequest.setAttribute('min', `${today}`)

let loanPayment = document.getElementById("loanRepayment")
loanPayment.setAttribute('min', `${today}`)

let account = document.getElementById("account")
let email = document.getElementById("email");
let loan = document.getElementById("loan-amt");
let submit = document.getElementById("submit");


let inputs = document.getElementsByTagName('input')
let selectDuration = document.getElementsByTagName('select')[0]

// change input fields of names to capital case
function capitalCase() {
    if (this.value) {
        let properText = this.value[0].toUpperCase() +
            this.value.slice(1);
        this.value = properText
    }
}

applicantfName.addEventListener('input', capitalCase)
applicantlName.addEventListener('input', capitalCase)


function checkEmptyFields() { // check empty fiels
    let numEmptyFields = 0
    let noEmptyFields = false
    let selectedDuration = false

    for (var input of inputs) {

        if (input.value === '') {
            document.getElementById("required-msg").style.display = "block";
            input.nextElementSibling.style.display = 'inline'
            input.classList.add('empty-field')
            numEmptyFields++
        } else {
            input.classList.remove('empty-field')
            input.nextElementSibling.style.display = 'none'

        }
    }

    if (selectDuration.value === '') {
        selectDuration.nextElementSibling.style.display = 'inline'
        selectDuration.classList.add('empty-field')

    } else {
        selectDuration.classList.remove('empty-field')
        selectDuration.nextElementSibling.style.display = 'none'
        selectedDuration = true
    }

    console.log('number of empty fields: ' + numEmptyFields)

    if (numEmptyFields === 0) {
        noEmptyFields = true
    }
    console.log('No Empty fields?: ' + noEmptyFields)
    console.log('final status: ' + (noEmptyFields && selectedDuration))

    return (noEmptyFields && selectedDuration)
}



function calculatePeriod(fromDate, toDate) { // calculate months

    let day = fromDate.getDate();
    let month = fromDate.getMonth() + 1;
    let year = fromDate.getFullYear();
    let yearDiff = Math.abs((year - toDate.getFullYear()) * 12);
    let monthDiff = Math.abs(month - (toDate.getMonth() + 1));
    let monthsPassed = yearDiff + monthDiff;
    let daysPassed = day - toDate.getDate();
    return [monthsPassed, daysPassed];
}



function submitApplication() {
    if (checkEmptyFields() && validateFields()) {
        document.getElementById("required-msg").style.display = "none";
        //create objects for local storage data
        let applicantInfo = {
                'FirstName': applicantfName.value,
                'LastName': applicantlName.value,
                'Email': email.value
            }
            //Awards points for each condition
        let pointsAwarded = 0
        if (parseInt(balance.value) > parseInt(loan.value)) {

            pointsAwarded += 10
            applicantInfo.LoanRequested = loan.value
        } else {

            pointsAwarded -= 10
            applicantInfo.Balance = 'Insufficient Balance'
            applicantInfo.LoanRequested = loan.value
        }

        if (parseInt(history.value) >= 6) {

            pointsAwarded += 10
        } else {

            pointsAwarded = pointsAwarded
            applicantInfo.Credit = 'Inconsistent Credit History for 6 Months'
        }

        let lastDepositDate = lastDeposit.value
        let lastDepositMonths = calculatePeriod(new Date(), new Date(lastDepositDate))[0]
        if (lastDepositMonths === 0) {

            pointsAwarded += 5
        } else {

            pointsAwarded = pointsAwarded
            applicantInfo.LastDeposit = 'Account not credited for over 1 month'
        }

        let lastLoanDate = lastLoan.value
        let [lastLoanMonths, lastLoanDays] = calculatePeriod(new Date(), new Date(lastLoanDate))
        if ((lastLoanMonths > 6) || ((lastLoanMonths === 6) && (lastLoanDays > 0))) {
            pointsAwarded += 10
        } else {
            pointsAwarded = pointsAwarded
            applicantInfo.LastLoan = `Your last approved loan was on ${new Date(lastLoanDate).toDateString()} which falls within 6 Months`
        }

        let loanRequestDate = loanRequest.value
        let loanPaymentDate = loanPayment.value
        let lastLoanRepaymentMonths = calculatePeriod(new Date(loanRequestDate), new Date(loanPaymentDate))[0]
        if (lastLoanRepaymentMonths < 6) {

            pointsAwarded += 5
            applicantInfo.DateRequested = new Date(loanRequestDate).toDateString()
            applicantInfo.DateRepayed = new Date(loanPaymentDate).toDateString()
        } else {
            pointsAwarded = pointsAwarded
            applicantInfo.Repayment = 'Long duration for loan repayment'
            applicantInfo.DateRequested = new Date(loanRequestDate).toDateString()

        }
        let accountType = account.value
        if (accountType === 'Current') {
            pointsAwarded += 10
        } else {
            pointsAwarded += 5
            applicantInfo.Account = 'Account Type'
        }

        applicantInfo.FinalPoints = pointsAwarded

        //write to local storage all inputted data
        localStorage.setItem('Loan-Application', JSON.stringify(applicantInfo))
            //redirect to page
        window.location.href = 'Application-status.html'


        console.log('All input fields are validated')
    } else {

        console.log('Unsuccessful input validation')
    }
}


// add event listeners to check balance, email, and amount entered
let validBalance = false;
let validEmail = false;
let validLoan = false;

function validateFields() { //validte values inputed
    const confirmedChecks = validBalance && validEmail && validLoan;
    console.log('confirmed Number format and email format?: ' + confirmedChecks);
    return confirmedChecks
}



balance.addEventListener('blur', function() {
    const numRegex = /^\s*(\d+(\.\d+)?)(\s*,\s*(\d+(\.\d+)?))*\s*$/;
    validBalance = numRegex.test(balance.value);
    validBalance ?
        (document.getElementById('invalid-num').style.display = 'none', balance.classList.remove('empty-field'), balance.nextElementSibling.style.display = 'none') :
        (document.getElementById('invalid-num').style.display = 'block', balance.classList.add('empty-field'));

    validateFields();
});

email.addEventListener('blur', function() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    validEmail = emailRegex.test(email.value);
    validEmail ?
        (document.getElementById('invalid-email').style.display = 'none', email.classList.remove('empty-field', email.nextElementSibling.style.display = 'none')) :
        (document.getElementById('invalid-email').style.display = 'block', email.classList.add('empty-field'));

    validateFields();
});

loan.addEventListener('blur', function() {
    const numRegex = /^\s*(\d+(\.\d+)?)(\s*,\s*(\d+(\.\d+)?))*\s*$/;
    validLoan = numRegex.test(loan.value);
    validLoan ?
        (document.getElementById('invalid-loan').style.display = 'none', loan.classList.remove('empty-field'), loan.nextElementSibling.style.display = 'none') :
        (document.getElementById('invalid-loan').style.display = 'block', loan.classList.add('empty-field'));
    validateFields();
});

// add event listeners for other fields

applicantfName.addEventListener('blur', function() {
    if (this.value !== '') {
        this.classList.remove('empty-field')
        this.nextElementSibling.style.display = 'none'
    }
})

applicantlName.addEventListener('blur', function() {
    if (this.value !== '') {
        this.classList.remove('empty-field')
        this.nextElementSibling.style.display = 'none'
    }
})

history.addEventListener('blur', function() {
    if (this.value !== '') {
        this.classList.remove('empty-field')
        this.nextElementSibling.style.display = 'none'
    }
})

lastDeposit.addEventListener('blur', function() {
    if (this.value !== '') {
        this.classList.remove('empty-field')
        this.nextElementSibling.style.display = 'none'
    }
})

lastLoan.addEventListener('blur', function() {
    if (this.value !== '') {
        this.classList.remove('empty-field')
        this.nextElementSibling.style.display = 'none'
    }
})

loanRequest.addEventListener('blur', function() {
    if (this.value !== '') {
        this.classList.remove('empty-field')
        this.nextElementSibling.style.display = 'none'
    }
})

loanPayment.addEventListener('blur', function() {
    if (this.value !== '') {
        this.classList.remove('empty-field')
        this.nextElementSibling.style.display = 'none'
    }
})


//add eventlistener to submit button
submit.addEventListener('click', submitApplication)