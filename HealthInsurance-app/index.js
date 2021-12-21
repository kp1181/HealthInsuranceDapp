var express = require('./node_modules/express');
var app = express();

app.use(express.static('src'));
app.use(express.static('../HealthInsurance-Contract/build/contracts'));
app.use(express.json());


app.get('/', function (req, res) {
  res.render('index.html');
});

if (typeof localStorage === "undefined" || localStorage === null) {
  LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./src');
  localStorage.removeItem('flagIndex')
}

if(localStorage.getItem('flagIndex')==='undefined' || localStorage.getItem('flagIndex')===null ) {
  localStorage.setItem('flagIndex.json', Math.floor((Math.random() * 243) + 1));
}

app.listen(3010, function () {
  console.log('Health Insurance Dapp listening on port 3010!');
});

// app.post('/saveClaimDetails',(req,res) => {
//     var inputData = req.body;
//     var inputKey = Object.keys(inputData)[0];
//     const fs = require('fs');
//     var next_id = -1;
//     fs.readFile("./files/claims.json", (err, data) => {  // READ
//         if (err) {
//             //return console.error(err);
//             res.sendStatus(500);
//             return;
//         };
    
        
//         var data = JSON.parse(data.toString());
//         userData = inputData[inputKey];
//         var next_id = data["next_id"];
//         data["next_id"]+=1;
//         data[next_id] = inputData[inputKey];

//         fs.writeFile("./files/claims.json", JSON.stringify(data), (err, result) => {  // WRITE
//             if (err) {
//                 //return console.error(err);
//                 res.sendStatus(500);
//                 return;
//             } else {
//                 console.log(result);
//                 console.log("Success");
//                 res.send(String(next_id));
//             }
//         });
//     });
//     //console.log(next_id);
//     //res.send(String(next_id));
// })

// app.get('/getAllClaims',(req,res)=>{
//     const fs = require('fs');
//     fs.readFile("./files/claims.json", (err, data) => {  // READ
//         if (err) {
//             console.error(err);
//             res.sendStatus(500);
//             return;
//         };
    
//         var data = JSON.parse(data.toString());
//         //console.log(data);
//         res.send(JSON.stringify(data));
//         return;
//     })
// })

// app.post('/removeClaimDetails',(req,res)=>{
//     var receivedJSON = req.body;
//     var receivedId = Object.keys(receivedJSON)[0];
//     console.log(receivedId);

//     const fs = require('fs');
//     fs.readFile("./files/claims.json", (err, data) => {  // READ
//         if (err) {
//             //return console.error(err);
//             res.sendStatus(500);
//             return;
//         };
    
//         var data = JSON.parse(data.toString());
//         delete data[receivedId];

//         fs.writeFile("./files/claims.json", JSON.stringify(data), (err, result) => {  // WRITE
//             if (err) {
//                 //return console.error(err);
//                 res.sendStatus(500);
//                 return;
//                 res.sendStatus(200);
//             }
//         });
//     });
// })

app.post('/saveClaimDetails',(req,res) => {
    var inputData = req.body;
    var inputKey = Object.keys(inputData)[0];
    const fs = require('fs');
    var next_id = -1;
    fs.readFile("./files/customerClaims.json", (err, data) => {  // READ
        if (err) {
            res.sendStatus(500);
            return;
        };
    
        
        var data = JSON.parse(data.toString());
        data[inputKey] = inputData[inputKey];

        fs.writeFile("./files/customerClaims.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                //return console.error(err);
                res.sendStatus(500);
                return;
            } else {
                console.log(result);
                console.log("Success");
                res.send(String(next_id));
            }
        });
    });
    //console.log(next_id);
    //res.send(String(next_id));
})

app.get('/getAllClaims/:uid',(req,res)=>{

    insuranceCompany_id = String(req.params.uid);
    console.log("id is:");
    console.log(insuranceCompany_id);
    const fs = require('fs');
    fs.readFile("./files/customerClaims.json", (err, data) => {  // READ
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        };
    
        var data = JSON.parse(data.toString());
        var allKeys = Object.keys(data);
        console.log(allKeys)
        var newData = {}
        myClaims = []
        for(i in allKeys){
            v = allKeys[i].split('_');
            var x = String(data[allKeys[i]].insuranceCompany).toLowerCase();
            //console.log(x===insuranceCompany_id)
            if(x==insuranceCompany_id.toLowerCase()){
                console.log("matched");
                myClaims.push(v[1])
                newData[v[1]] = data[allKeys[i]];
            }
        }
        console.log(newData);

        res.send(JSON.stringify(newData));
        return;
    })
})

app.post('/removeClaimDetails/:uid',(req,res)=>{
    var receivedJSON = req.body;
    var customer_address = String(req.params.uid);
    var receivedId = Object.keys(receivedJSON)[0];
    var keyInFile = customer_address+"_"+receivedId;
    console.log(customer_address);
    console.log(receivedId);
    console.log(keyInFile);

    const fs = require('fs');
    fs.readFile("./files/customerClaims.json", (err, data) => {  // READ
        if (err) {
            //return console.error(err);
            res.sendStatus(500);
            return;
        };
    
        var data = JSON.parse(data.toString());
        delete data[keyInFile];

        fs.writeFile("./files/customerClaims.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                //return console.error(err);
                res.sendStatus(500);
                return;
            }
            else{
                res.sendStatus(200);
            }
        });
    });
})