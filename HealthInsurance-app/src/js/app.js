web3= new Web3(window.web3.currentProvider); 
var contractAddress='0x4de1f1C46DBDb787057D59228128aCE15a38fd8c';
var decentralized_address_p = document.getElementById('decentralized_address');
var abi;
var currentAccount;
//var current_account_position;

var c_abi;
var HealthInsuranceContract;
var claims;

if(window.ethereum) {
    window.ethereum.on('accountsChanged', function () {
        window.location.reload();
    });
}

async function getCurrentAccount(){
    const acc = await ethereum.request({ method: 'eth_requestAccounts'});
    return acc[0];
}



$.getJSON('../HealthInsurance.json').then(function(data){
    c_abi = data['abi'];
    HealthInsuranceContract = new web3.eth.Contract(c_abi,contractAddress);
    getCurrentAccount().then((value)=>{decentralized_address_p.innerHTML+=value; currentAccount = value; getClaimDetails();});
});


function updatePositions(){
    var position = document.getElementById("positionDropdown").value;
    var adminDiv = document.getElementById("adminDiv");
    var insuranceCompanyDiv = document.getElementById("insuranceCompanyDiv");
    var customerDiv = document.getElementById("customerDiv");
    var publicDiv = document.getElementById("publicDiv");
    if(position=='admin'){
        adminDiv.style.display = "block";
        insuranceCompanyDiv.style.display = "none";
        customerDiv.style.display = "none";
        publicDiv.style.display = "none";
    }
    if(position=='insuranceCompany'){
        adminDiv.style.display = "none";
        insuranceCompanyDiv.style.display = "block";
        customerDiv.style.display = "none";
        publicDiv.style.display = "none";
    }
    if(position=='customer'){
        adminDiv.style.display = "none";
        insuranceCompanyDiv.style.display = "none";
        customerDiv.style.display = "block";
        publicDiv.style.display = "none";
    }
    if(position=='public'){
        adminDiv.style.display = "none";
        insuranceCompanyDiv.style.display = "none";
        customerDiv.style.display = "none";
        publicDiv.style.display = "block";
    }
}

function register(InputAddress, role){
    console.log("Registering ");
    //var InputAddress = document.getElementById("chair_reg_customer_addr").value;
    var success=1;
    var tmp = async function(){ 
        try{
            role_bytes32 = web3.utils.padLeft(web3.utils.asciiToHex(role), 64);
            return await HealthInsuranceContract.methods.register(InputAddress, role_bytes32).send({from:currentAccount});
        } 
        catch(e){
            success=0;
            alert("Transaction failed");
        }
    }
    tmp().then((val)=>{
        console.log(val);
        if(success==1){
            alert("Success");
        }
    }); 
}

function unregister(InputAddress, role){
    console.log("unregistering ");
    //var InputAddress = document.getElementById("chair_reg_customer_addr").value;
    var success=1;
    var tmp = async function(){ 
        try{
            role_bytes32 = web3.utils.padLeft(web3.utils.asciiToHex(role), 64);
            return await HealthInsuranceContract.methods.unregister(InputAddress, role_bytes32).send({from:currentAccount});
        } 
        catch(e){
            success=0;
            alert("Transaction failed");
        }
    }
    tmp().then((val)=>{
        console.log(val);
        if(success==1){
            alert("Success");
        }
    }); 
}

async function uploadJSONData(claimJSON){
    try {
        //const response = await axios.post('/saveClaimDetails',claimJSON);
        url="saveClaimDetails";
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(claimJSON)
        }
        let response = await fetch(url, config);
    
        return response.text();
    
      } catch (e) {
        console.log(e);
      }
}


async function recordClaimCreation(customer_insurance_company_id, customer_hospital_id, customer_n_tokens){
    var success=1;
    var tmp = async function(){ 
        try{
            return await HealthInsuranceContract.methods.createClaim(customer_insurance_company_id, customer_hospital_id, customer_n_tokens).send({from:currentAccount});
        } 
        catch(e){
            success=0;
            alert("Transaction failed");
        }
    }
    return tmp().then((response)=>{
        return_val = response.events.returnEvent.returnValues.val;
        console.log(return_val);
        if(success==1){
            alert("success");
            return return_val;
            }
        }); 
}

async function saveClaimDetails(){
    var customer_name = document.getElementById("customer_name").value;
    var customer_insurance_company_id = document.getElementById("customer_insuranceCompany").value;
    var customer_hospital_id = document.getElementById("customer_hospital").value;
    var customer_description = document.getElementById("customer_description").value;
    var customer_n_tokens = document.getElementById("customer_n_tokens").value;


    var generated_id = recordClaimCreation(customer_insurance_company_id, customer_hospital_id, customer_n_tokens).then((generated_id)=>{
        var claimJSON  = {};
        var db_id = currentAccount+'_'+generated_id;
        claimJSON[db_id] = {
            customer_address: currentAccount,
            name: customer_name,
            desc : customer_description,
            insuranceCompany : customer_insurance_company_id,
            hospital : customer_hospital_id,
            tokens: customer_n_tokens
        }
        uploadJSONData(claimJSON)
    });
    

    // uploadJSONData(claimJSON).then((generatedId)=>{
    //     recordClaimCreation(customer_insurance_company_id, customer_hospital_id, customer_n_tokens, generatedId);
    // });
}

async function getClaimDetails(){
    
    insuranceCompanyAddress = currentAccount;
    url="getAllClaims/"+insuranceCompanyAddress;
    console.log(url);
    try {
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        await fetch(url, config).then(response => response.json())
            .then(data => {
                console.log(data);
                delete claims;
                claims = data;
                delete claims["next_id"]
                populateClaims();
            }).catch(()=>{
            ///Exception occured do something
        });

    } catch (error) {
            alert("Something went wrong");
    }
    
}


async function repopulateClaims(){
    console.log("repopulating claims");
    var claims_box = document.getElementById("claimsBox");
    claims_box.innerHTML = ""
    claims_box.innerHTML = `<div class="form-group row">
    <label for="ID" class="col-sm-1 col-form-label">ID</label>
    <label for="Address" class="col-sm-2 col-form-label">Address</label>
    <label for="Name" class="col-sm-1 col-form-label">Name</label>
    <label for="InsuranceCompany" class="col-sm-1 col-form-label">Insurance Company</label>
    <label for="Hospital" class="col-sm-1 col-form-label">Hospital</label>
    <label for="Description" class="col-sm-2 col-form-label">Description</label>
    <label for="Tokens" class="col-sm-2 col-form-label">Tokens</label>
    <label for="blank" class="col-sm-1 col-form-label"></label>
    <label for="blank" class="col-sm-1 col-form-label"></label>
</div>`;
    await getClaimDetails();
}

function populateClaims(){
    console.log("populating claims");
    var claims_box = document.getElementById("claimsBox");
    
    var allKeys= Object.keys(claims);
    console.log(allKeys);
    for (let i = 0; i < allKeys.length; i++) {
        console.log(claims[allKeys[i]]);
        claims_box.innerHTML += `<div class="form-group row claim_row">
        <label for="ID" class="col-sm-1 col-form-label" id="claim_row_id_`+allKeys[i]+`">
        `+allKeys[i]+`</label>
        <label for="ID" class="col-sm-2 col-form-label" id="claim_row_address_`+allKeys[i]+`">
        `+claims[allKeys[i]].customer_address+`</label>
        <label for="Name" class="col-sm-1 col-form-label" id="claim_row_name_`+allKeys[i]+`">`+claims[allKeys[i]].name+`</label>
        <label for="InsuranceCompany" class="col-sm-1 col-form-label" id="claim_row_insurance_`+allKeys[i]+`">`+claims[allKeys[i]].insuranceCompany+`</label>
        <label for="Hospital" class="col-sm-1 col-form-label" id="claim_row_hospital_`+allKeys[i]+`">`+claims[allKeys[i]].hospital+`</label>
        <label for="Description" class="col-sm-1 col-form-label" id="claim_row_desc_`+allKeys[i]+`">`+claims[allKeys[i]].desc+`</label>
        <label for="Tokens" class="col-sm-2a col-form-label" id="claim_row_tokens_`+allKeys[i]+`">`+claims[allKeys[i]].tokens+`</label>
        <button class="btn btn-primary " style="margin-left: 80px !important;max-height: 40px;margin-top:5px" onclick="processClaim(this.id,'genuine')" id="claim_row_approve_`+allKeys[i]+`">Approve claim</button>
        <button class="btn btn-primary " style="margin-left: 80px !important;max-height: 40px;margin-top:5px" onclick="processClaim(this.id,'fraud')" id="claim_row_report_fraud_`+allKeys[i]+`">Report Fraud claim</button>
    </div>`;
    }

}

async function processClaim(clicked_id, type){
    current_claim_id = clicked_id.split("_").at(-1);

    var name = document.getElementById("claim_row_name_"+current_claim_id).textContent;
    var customer_address = document.getElementById("claim_row_address_"+current_claim_id).textContent.trim();
    var InsuranceCompany = document.getElementById("claim_row_insurance_"+current_claim_id).textContent.trim();
    var Hospital = document.getElementById("claim_row_hospital_"+current_claim_id).textContent.trim();
    var desc = document.getElementById("claim_row_desc_"+current_claim_id).textContent;
    var tokens = document.getElementById("claim_row_tokens_"+current_claim_id).textContent.trim()+"00";

    console.log(name); 
    console.log(customer_address);
    console.log(desc);
    console.log(tokens);
    

    var success=1;
    var tmp = async function(){  
        try{
            //return await HealthInsuranceContract.methods.approveValidClaim(customer_address, 1, desc, tokens).send({from:currentAccount});
            if(type=="fraud"){
                return await HealthInsuranceContract.methods.processClaim(customer_address,Hospital,  1, tokens, current_claim_id).send({from:currentAccount});
            }
            else{
                return await HealthInsuranceContract.methods.processClaim(customer_address,Hospital,  0, tokens, current_claim_id).send({from:currentAccount});
            }
        } 
        catch(e){
            console.log(e);
            success=0;
            alert("Transaction failed");
        }
    }
    tmp().then((val)=>{
        console.log(val);
        if(success==1){
            removeClaim(current_claim_id);
            alert("Success");
        }
    }); 
}

async function removeClaim(current_claim_id){
    var customer_address = document.getElementById("claim_row_address_"+current_claim_id).textContent.trim();
    
    url="removeClaimDetails/"+customer_address;
    console.log(JSON.stringify(current_claim_id));
    var deleteIdJSON = {}
    deleteIdJSON[current_claim_id] = {}

    try {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteIdJSON)
        }
        const response = await fetch(url, config)
        if (response.ok) {
            console.log("claim removed");
            repopulateClaims()
            return response
        } else {
            console.log("claim not removed");
            //
        }
    } catch (error) {
        console.log("claim not removed");
    }

}

function checkHospital(){
    InsuranceCompanyAddress = document.getElementById("pub_insurance_company").value;
    HospitalAddress = document.getElementById("pub_hospital").value;

    var success=1;
    var tmp = async function(){ 
        try{
            return await HealthInsuranceContract.methods.checkIfHospitalAvailble(InsuranceCompanyAddress, HospitalAddress).call({from:currentAccount});
        } 
        catch(e){
            success=0;
            alert("Transaction failed");
        }
    }
    tmp().then((val)=>{
        console.log(val);
        if(success==1){
            alert(val);
        }
    }); 
}
