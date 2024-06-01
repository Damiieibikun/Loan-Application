
//Navigation
let today = new Date().toDateString();
document.getElementById("currentdate").innerText = today;
let count = 0
let message = document.getElementById("message")
let notification_icon = document.getElementById("notification-num")
function showMsg(event) {
  if(event.target!==notification_icon){
    console.log('clicked outside')
    message.style.display = "none"
  }
  else{
    if(count%2==0){
 
      message.style.display = "block"
     }
     else{
      message.style.display = "none"
     }
  }
 
 count++
 
}

//Loan application
//Retrieve data from local storage
let applicantDetails = JSON.parse(
  localStorage.getItem("Loan-Application")
);


//applicant's name
document.getElementById('name').innerText = `${applicantDetails.FirstName},`

//approved letter template
document.getElementById('applicantEmail').innerText = applicantDetails.Email
let introLetter_aprov = `<h2>Loan Approval from Quantum Leap</h2>

<h3>Dear ${applicantDetails.FirstName},</h3>

<p>We are pleased to inform you that your application for the amount of <b>$${applicantDetails.LoanRequested}</b> has been approved!.
<br>
Your application met all of our requirements, and we believe this loan will be a valuable tool to help you achieve your financial goals.
<br><br>
Your Loan Details: </p>`;

let closingLetter_approv = `

<p>To finalize your loan, please:
<ul>
<li>Sign and return a copy of the enclosed loan agreement.</li>
<li>
Provide any additional documentation that may be required (list any specific documents). 
</li>
</ul>

Once we receive the signed agreement and any requested documents, we will process your loan and disburse the funds within 10 business days.</p>
<br>
<p>
We are confident that you will make good use of this loan.  
<br><br>Congratulations on your approval, and please do not hesitate to contact a loan officer at
at (+123)-456-789 or email at customercare@quantumleap.com.</p>
<br>
<p> 
Sincerely,
<br><br>
<p>
Damilola Ibikunle
<br>
Senior Loan Officer
<br><br>
<i>Quantum Leap
<br>
123 Somewhere, Someplace.</i>
</p>`;

//rejection letter template
let introLetter_rej = `<h2>Update on your Loan application from Quantum Leap</h2>

<h3>Dear ${applicantDetails.FirstName},</h3>

<p>Thank you for your interest in a loan from Quantum Leap. We carefully reviewed your application for a loan in the amount of <b>$${applicantDetails.LoanRequested}</b>.

<br>
We are unable to approve your loan application at this time.

<br>
After a thorough review of your application, we were unable to meet your request based on the following criteria: </p>`;

let closingLetter_rej = `
<br><br>
<p>We understand that this news may be disappointing. We encourage you to contact a loan officer at (+123)-456-789 or customercare@quantumleap.com to discuss your application further. 
We may be able to offer suggestions for improving your creditworthiness.</p>
Sincerely,
<br><br>
<p>
Damilola Ibikunle
<br>
Senior Loan Officer
<br><br>
<i>Quantum Leap
<br>
123 Somewhere, Someplace.</i></p>`;

///////////////////////////////////////////////////////

if (applicantDetails.FinalPoints < 30) {
  //display critera
  for (var i in applicantDetails) {
    if (
      i !== "FirstName" &&
      i !== "LastName" &&
      i !== "Email" &&
      i !== "DateRequested" &&
      i !== "DateRepayed" &&
      i !== "FinalPoints" &&
      i !== "LoanRequested"
    ) {
      var li = document.createElement("li");
      li.innerHTML = `${i}: ${applicantDetails[i]}`;
      document.getElementById("criteria").append(li);
    }
  }

  document.getElementById("intro-letter").innerHTML = introLetter_rej;
  document.getElementById("closing-letter").innerHTML = closingLetter_rej;
} else {//display approved letter
  let li = document.createElement("li");
  li.innerText = `Request Date: ${applicantDetails.DateRequested}`;        
  let li2 = document.createElement("li");
  li2.innerText = `Repayment Date: ${applicantDetails.DateRepayed}`; 
  let li3 = document.createElement("li");
  li3.innerText = '2% per Month';
  document.getElementById("criteria").append(li);
  document.getElementById("criteria").append(li2);
  document.getElementById("criteria").append(li3);


  document.getElementById("intro-letter").innerHTML = introLetter_aprov;
  document.getElementById("closing-letter").innerHTML = closingLetter_approv;
}

function showLetter(){
  document.getElementById('app-letter').style.display = 'block'
  document.getElementById('dot').style.color = 'black'
  document.getElementById('message').style.display = 'none'
  document.getElementById('hero-img').style.display = 'none'
}







let hamMenu = document.getElementById('collasped-menu')


function showNav(event){
  if(event.target===hamMenu){
    document.getElementById('links').classList.toggle('toggle-a')
    document.getElementById('links').firstElementChild.classList.toggle('flex')
    document.getElementById('links').firstElementChild.classList.toggle('toggle-list')
    document.getElementById('links').classList.toggle('links')
  }
  else{
    document.getElementById('links').firstElementChild.classList.add('flex')
    document.getElementById('links').classList.add('links')
    document.getElementById('links').classList.remove('toggle-a')
    document.getElementById('links').firstElementChild.classList.remove('toggle-list')
  }
  
  
}

// document.getElementById('collasped-menu').addEventListener('click', showNav)

document.addEventListener('click', showMsg)
document.addEventListener('click', showNav)