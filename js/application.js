const today = new Date().toISOString().slice(0, 10)

let applicantfName = document.getElementById("firstName");

let applicantlName = document.getElementById("lastName");

let balance = document.getElementById("balance");

let history = document.getElementById("history")

let lastDeposit = document.getElementById("last-deposit")
lastDeposit.setAttribute('max', `${today}`)

let lastLoan = document.getElementById("last-loan")
lastLoan.setAttribute('max', `${today}`)

let loanRequest = document.getElementById("loanRequest")
loanRequest.setAttribute('min', `${today}`)

let loanPayment = document.getElementById("loanRepayment")
loanPayment.setAttribute('min', `${today}`)

let account = document.getElementById("account")

let email = document.getElementById("email");
let loan = document.getElementById("loan-amt");
let submit = document.getElementById("submit");


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


function submitApplication() {
    if (checkFields()) {
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
        } else {


            pointsAwarded -= 10
            applicantInfo.balance = 'Insufficient Balance'
        }

        if (parseInt(history.value) >= 6) {

            pointsAwarded += 10
        } else {

            pointsAwarded = pointsAwarded
            applicantInfo.credit = 'Inconsistent Credit History for 6 Months'
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
            applicantInfo.LastLoan = `Your last approved loan was on ${new Date(lastLoanDate).toDateString()} falls within 6 Months`
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
        console.log(applicantInfo)

        //write to local storage all inputted data
        localStorage.setItem('Loan-Application', JSON.stringify(applicantInfo))
            //redirect to page
        // window.location.href = 'Application-status.html'
            //on home page retrieve data from local storage
            //depending on the score and inpuuted values, render relevant text in innerhtml

        console.log('All input fields are validated')
    } else {
        console.log('Unsuccessful input validation')
    }
}

function checkFields() {
    let numEmptyFields = 0
    let noEmptyFields = false
    let passedChecks = false
    let validBalance = false
    let validEmail = false
    let validLoan = false
    let inputs = document.getElementsByTagName('input')
    for (var input of inputs) {
        if (input.value === '') {
            document.getElementById("required-msg").style.display = "block";
            input.nextElementSibling.style.display = 'inline'
            numEmptyFields++
        } else {
            // document.getElementById("required-msg").style.display = "none";
            input.nextElementSibling.style.display = 'none'
            if (input.id === 'balance') {
                const numRegex = /^\s*(\d+(\.\d+)?)(\s*,\s*(\d+(\.\d+)?))*\s*$/;
                validBalance = numRegex.test(input.value)
                validBalance ? document.getElementById('invalid-num').style.display = 'none' : document.getElementById('invalid-num').style.display = 'block'

            } else if (input.id === 'email') {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                validEmail = emailRegex.test(input.value)
                validEmail ? document.getElementById('invalid-email').style.display = 'none' : document.getElementById('invalid-email').style.display = 'block'
            } else if (input.id === 'loan-amt') {
                const numRegex = /^\s*(\d+(\.\d+)?)(\s*,\s*(\d+(\.\d+)?))*\s*$/;
                validLoan = numRegex.test(input.value)
                validLoan ? document.getElementById('invalid-loan').style.display = 'none' : document.getElementById('invalid-loan').style.display = 'block'
            }

        }
    }
    console.log('balance validated?: ' + validBalance)
    console.log('email validated?: ' + validEmail)
    console.log('loan amount validated?: ' + validLoan)

    passedChecks = validBalance && validEmail && validLoan

    console.log('number of empty fields: ' + numEmptyFields)
    console.log('passed all checks: ' + passedChecks)
    if (numEmptyFields === 0) {
        noEmptyFields = true
    }
    console.log('No Empty fields?: ' + noEmptyFields)
    console.log('final status: ' + (noEmptyFields && passedChecks))

    return (noEmptyFields && passedChecks)
}

function calculatePeriod(fromDate, toDate) {

    let day = fromDate.getDate();
    let month = fromDate.getMonth() + 1;
    let year = fromDate.getFullYear();
    let yearDiff = Math.abs((year - toDate.getFullYear()) * 12);
    let monthDiff = Math.abs(month - (toDate.getMonth() + 1));
    let monthsPassed = yearDiff + monthDiff;
    let daysPassed = day - toDate.getDate();
    return [monthsPassed, daysPassed];
}


//add eventlistener to submit button
submit.addEventListener('click', submitApplication)




//   if (
//     candidatefName.value === "" ||
//     candidatelName.value === "" ||
//     examDate.value === "" ||
//     jobRole.value === ""
//   ) {
//     document.getElementById("required-msg").style.display = "block";
//     let required = document.getElementsByClassName("required");
//     for (var i of required) {
//       i.style.display = "inline";
//     }
//   } else {
//     let firstName =
//       candidatefName.value[0].toUpperCase() + candidatefName.value.slice(1);
//     let lastName =
//       candidatelName.value[0].toUpperCase() + candidatelName.value.slice(1);
//     let date = examDate.value.split("-");
//     let role = jobRole.value;
//     let scoreA = parseInt(aptitudeScore.value);
//     let scoreB = parseInt(codingScore.value);

//     var day = parseInt(date[2]);
//     var month = parseInt(date[1]);
//     var year = parseInt(date[0]);

//     var new_day =
//       day === 13
//         ? `${day}th`
//         : (day - 1) % 10 === 0
//         ? `${day}st`
//         : (day - 2) % 10 === 0
//         ? `${day}nd`
//         : (day - 3) % 10 === 0
//         ? `${day}rd`
//         : `${day}th`;

//     switch (month) {
//       case 1:
//         month = "January";
//         break;
//       case 2:
//         month = "Febuary";
//         break;
//       case 3:
//         month = "March";
//         break;
//       case 4:
//         month = "April";
//         break;
//       case 5:
//         month = "May";
//         break;
//       case 6:
//         month = "June";
//         break;
//       case 7:
//         month = "July";
//         break;
//       case 8:
//         month = "August";
//         break;
//       case 9:
//         month = "September";
//         break;
//       case 10:
//         month = "October";
//         break;
//       case 11:
//         month = "November";
//         break;
//       case 12:
//         month = "December";
//         break;
//     }

//     let acceptanceLetter = `<h2>Subject: Interview Invitation - ${role} at Quantum Leap</h2>

//   <h3>Dear ${firstName} ${lastName},</h3>
//   <b>Congratulations!</b>

//   <p>We are pleased to inform you that you successfully passed both the Aptitute test and live coding challenge taken on ${new_day} of ${month} ${year} and we are pleased to 
//   invite you for an interview for the position of ${role} at Quantum Leap. We were impressed by your application and believe your qualifications and experience align well with the requirements of this role.</p>
//   <br>

//   <b>Interview Details:</b>

//   <ul>
//   <li>Date: 21st May 2024</li>
//   <li>Time: 9am</li>
//   <li>Location: Rework Academy - House C5, Aknaton estate, Gospel light avenue, off dunamis road, Durumi, Area 1, Abuja.</li>
//   <li>Duration: Approximately 2 hours</li>

//   </ul>

//   <br>
//   <b>About the Interview:</b>

//   <p>The interview will be an opportunity for us to learn more about your skills and experience, and for you to learn more about the ${role} role and Quantum Leap. We will discuss your resume in detail and ask questions related to your qualifications and how you see yourself contributing to our team.

//   Please note: If there are any documents you should bring to the interview (portfolio, references, etc.), you can mention them here.

//   We look forward to meeting you and learning more about you.  Please confirm your availability for the interview by replying to this email. If you have any questions, please do not hesitate to contact us.
//   </p>
//   <br><br>
//   Sincerely,
//   <br>
//   <p>
//   Damilola Ibikunle
//   <br>
//   Senior Front End Developer
//   <br><br>
// <i>Quantum Leap
// <br>
// 123 Silcon Valley, San Francisco.</i></p>`;

//     let rejectionLetter = `<h2>Subject: Update on your application for ${role} at Quantum Leap</h2>

// <h3>Dear ${firstName} ${lastName},</h3>

// <p>Thank you for your interest in the ${role} position at Quantum Leap and for taking the time to interview with us. We appreciate you sharing your skills and experience.
// <br>
// We have reviewed your scores based on the examination taken on ${new_day} of ${month} ${year} and after careful consideration, we have decided to move forward with another candidate whose qualifications more closely align with the specific requirements of this role.

// The decision was very difficult as we received many qualified applications. 

// We wish you the very best in your job search and future endeavors.

// </p>
// <br><br>
// Sincerely,
// <br>
// <p>
// Damilola Ibikunle
// <br>
// Senior Front End Developer
// <br><br>
// <i>Quantum Leap
// <br>
// 123 Silcon Valley, San Francisco.</i></p>`;

//     if (scoreA > 100 || scoreA < 0 || scoreB > 100 || scoreB < 0) {
//       alert("You have entered an invalid score");
//     } else {
//       if (scoreA > 75 && scoreB > 75) {
//         let avgScore = (scoreA + scoreB) / 2;
//         if (avgScore >= 80) {
//           document.getElementById("body").innerHTML = acceptanceLetter;
//           document.getElementById("body").style.alignItems = "start";
//         } else {
//           document.getElementById("body").innerHTML = rejectionLetter;
//           document.getElementById("body").style.alignItems = "start";
//         }
//       } else {
//         document.getElementById("body").innerHTML = rejectionLetter;
//         document.getElementById("body").style.alignItems = "start";
//       }
//     }
//   }
// });