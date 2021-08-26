
var firebaseConfig = {
    apiKey: "AIzaSyASoWv-H6lGIRvSrlhQFlIh5fSAb7AkKko",
    authDomain: "vip-fcb22.firebaseapp.com",
    projectId: "vip-fcb22",
    storageBucket: "vip-fcb22.appspot.com",
    messagingSenderId: "250305837446",
    appId: "1:250305837446:web:d21ff70c12ab88011d1407",
    measurementId: "G-40V00QNPS7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let db = firebase.firestore();
let auth = firebase.auth();
let storage = firebase.storage();

let userName = document.getElementById('username');
let email = document.getElementById('email');
let password = document.getElementById('password');


let resName = document.getElementById('resName');
let cityName = document.getElementById('cityName');
let countryName = document.getElementById('countryName');
let phoneNumber = document.getElementById('phoneNumber');

function restRegister() {

    auth.createUserWithEmailAndPassword(email.value, password.value)
        .then(async (UserCredientials) => {
            let dataObj = {
                email: UserCredientials.user.email,
                username: userName.value,
                restaurent: resName.value,
                cityName: cityName.value,
                countryName: countryName.value,
                UID: UserCredientials.user.uid
            }
            await saveDataToFirestoreRestaurant(dataObj)

            if (UserCredientials.user) {
                email.value = '';
                password.value = '';
                userName.value = '';
            }
        })
        .catch((error) => {
            console.log(error.message)
        })





}


function userRegister() {

    auth.createUserWithEmailAndPassword(email.value, password.value)
        .then(async (UserCredientials) => {
            let dataObj = {
                email: UserCredientials.user.email,
                username: userName.value,
                phoneNumber: phoneNumber.value,
                cityName: cityName.value,
                countryName: countryName.value,
                UID: UserCredientials.user.uid
            }
            await saveDataToFirestoreUsers(dataObj)
            if (UserCredientials.user) {
                email.value = '';
                password.value = '';
                userName.value = '';
            }
        })
        .catch((error) => {
            console.log(error.message)
        })
}


async function login() {

    auth.signInWithEmailAndPassword(email.value, password.value)
        .then(async (UserCredientials) => {
            console.log('Login')
            let currentUser = auth.currentUser

            setTimeout(async () => {
                let data = await db.collection('restaurant').get()
                data.forEach(async function (dataEl) {
                    if (dataEl.data().email === currentUser.email) {
                        window.location = 'dashboard.html'
                    } else {
                        let dataU = await db.collection('users').get()
                        dataU.forEach(function (dataEl) {
                            if (dataEl.data().email === currentUser.email) {
                                window.location = 'userhome.html'
                            }
                        })
                    }


                })


            }, 1000);
        })
        .catch((error) => {
            console.log(error.message)
        })

}

async function saveDataToFirestoreUsers(dataObjEl) {
    let currentUser = auth.currentUser;
    await db.collection('users').doc(currentUser.uid).set(dataObjEl)
    console.log('agha', currentUser.uid)
    setTimeout(() => {
        window.location = 'userhome.html';
    }, 1000);
}

async function saveDataToFirestoreRestaurant(dataObjEl) {
    let currentUser = auth.currentUser;
    await db.collection('restaurant').doc(currentUser.uid).set(dataObjEl)
    console.log('agha', currentUser.uid)
    setTimeout(() => {
        window.location = 'dashboard.html'
    }, 1000);
}


auth.onAuthStateChanged(async (user) => {
    let pageLocArr = window.location.href.split('/');
    let pageName = pageLocArr[pageLocArr.length - 1];
    let authenticatedPages = ['home.html', 'index.html', 'credient.html', 'dashboard.html' ];
    console.log(user)


    setTimeout(async function () {
        // let restDataRest = await db.collection('restuarent').get()
        // let restDataUser = await db.collection('users').get()
        // if (user && authenticatedPages.indexOf(pageName) === -1) {
        //     window.location = '/components/home.html';
        // }

        if (!user && pageName === 'dashboard.html' ) {
            window.location.replace('../index.html');
        }
        else if (!user && pageName === 'userhome.html') {
            window.location.replace('../index.html');
        }

    }, 1000)



});




async function logOut() {

    await auth.signOut()

}

let mainCont = document.getElementById('mainCont')
function credientials() {
    let location = window.location.replace('components/credient.html')

}

function mainLoad() {
    let butnUser = document.createElement('button');
    let butnRest = document.createElement('button');
    butnUser.className = 'btn btn-lg btn-primary btnUser';
    butnRest.className = 'btn btn-secondary btn-lg btnCus';
    let textNodeUser = document.createTextNode('Restuarent Owner')
    let textNodeCustomer = document.createTextNode('Customer')
    butnUser.innerHTML = '<i class="fas fa-store"></i> ';
    butnRest.innerHTML = '<i class="fas fa-shopping-basket"></i> ';
    butnUser.appendChild(textNodeUser);
    butnRest.appendChild(textNodeCustomer);
    mainCont.appendChild(butnRest);
    mainCont.appendChild(butnUser);
    butnUser.onclick = function () {
        window.location.replace('rest.html')
    };
    butnRest.onclick = function () {
        window.location('user.html')

    }
}

let dType = document.getElementById('dType');
let category = document.getElementById('category')

// function typeDeliver(){

// }


let dataLoadPending = document.getElementById('dataLoadPending')
async function dataRecieveAll() {
    setTimeout(async () => {
        let currentUser = auth.currentUser;
        let dataPending = await db.collection('restaurant').doc(currentUser.uid).collection('order').onSnapshot(function(data){
            dataLoadPending.querySelectorAll('*').forEach(n => n.remove());
            data.forEach(function (dataAc) {
                console.log(dataAc.data())
                // if(orderData.data().resturantUid === dataOn.data().UID){
                let div1 = document.createElement('div')
                div1.className = 'p-1 bg-light border';
                div1.innerHTML = dataAc.data().itemname;
                div1.id = dataAc.id;
                let btnDiv = document.createElement('button');
                let btntextDiv = document.createTextNode('Accept')
                btnDiv.appendChild(btntextDiv)
                btnDiv.className = 'btn btn-primary';
                btnDiv.setAttribute('onclick', 'acceptBtn(this)')
                div1.appendChild(btnDiv)
                dataLoadPending.appendChild(div1)
                // }
                // })
            })  
        })
       

    }, 1000);
    //    

}

let adminControlId = document.getElementById('adminControlId');

let productAddId = document.getElementById('productAddId');

productAddId.style.display = 'none';

function addProductFunc(){
    adminControlId.style.display = 'none'
    productAddId.style.display = 'block';
    

}

let backBtnAdmin = document.getElementById('backBtnAdmin');
function backBtnAdminFunc(){
    adminControlId.style.display = 'block'
    productAddId.style.display = 'none';
}




let dataLoadAccepted = document.getElementById('dataLoadAccepted')
async function acceptBtn(Ele) {
    // console.log(Ele.parentNode.firstChild.nodeValue)
    let currentUser = auth.currentUser;
    let item = document.getElementById(Ele.parentNode.id);
    // console.log(item.firstChild.nodeValue)

    let dataAccept = await db.collection('restaurant').doc(currentUser.uid).collection('accepted').add({
        itemname: item.firstChild.nodeValue,
        currentUserOfOwner: currentUser.uid
    })
    console.log(dataAccept.id);

    await db.collection('restaurant').doc(currentUser.uid).collection('order').doc(Ele.parentNode.id).delete();
    Ele.parentNode.remove();


}

async function dataAcceptOnLoad() {
    setTimeout(async () => {
        let currentUser = auth.currentUser;
         await db.collection('restaurant').doc(currentUser.uid).collection('accepted').onSnapshot(function (data) {
            dataLoadAccepted.querySelectorAll('*').forEach(n => n.remove());
            data.forEach(function(dataOn){
                 let div1 = document.createElement('div')
            div1.className = 'p-1 bg-light border';
            div1.innerHTML = dataOn.data().itemname;
            div1.id = dataOn.id;
            let btnDiv = document.createElement('button');
            let btntextDiv = document.createTextNode('Delievered')
            btnDiv.appendChild(btntextDiv)
            btnDiv.className = 'btn btn-primary';
            btnDiv.setAttribute('onclick', 'delieverBtn(this)')
            div1.appendChild(btnDiv)
            dataLoadAccepted.appendChild(div1)
             })
            
        })




    }, 1000);
}
dataAcceptOnLoad()

let dataLoadDelievered = document.getElementById('dataLoadDelievered')
async function delieverBtn(Ele){
    // console.log(Ele.parentNode.id)
    let currentUser = auth.currentUser;
    let EleId = document.getElementById(Ele.parentNode.id);
    // console.log(EleId.firstChild.nodeValue)
    // divContPro.querySelectorAll('*').forEach(n => n.remove());
   await db.collection('restaurant').doc(currentUser.uid).collection('delievered').doc(EleId.id).set({
        itemdel : `${EleId.firstChild.nodeValue} Has Been Delievered`
    })

    await db.collection('restaurant').doc(currentUser.uid).collection('accepted').doc(Ele.parentNode.id).delete();
    Ele.parentNode.remove();
}


async function dataDelievered(){
    setTimeout(async () => {
        let currentUser = auth.currentUser;
        await db.collection('restaurant').doc(currentUser.uid).collection('delievered').onSnapshot(function (data) {
            dataLoadDelievered.querySelectorAll('*').forEach(n => n.remove());
            data.forEach(function(dataOn){
                let div1 = document.createElement('div')
           div1.className = 'p-1 bg-light border';
           div1.innerHTML = dataOn.data().itemdel;
           div1.id = dataOn.id;
           let btnDiv = document.createElement('button');
           let btntextDiv = document.createTextNode('Delete')
           btnDiv.appendChild(btntextDiv)
           btnDiv.setAttribute('onclick', 'deteteDelBtn(this)')
           btnDiv.className = 'btn btn-primary';
          div1.appendChild(btnDiv)
         
           dataLoadDelievered.appendChild(div1)
            })
           
       })

    }, 1000);
}

dataDelievered()



async function deteteDelBtn(Ele){
    let currentUser = auth.currentUser;
    await db.collection('restaurant').doc(currentUser.uid).collection('delievered').doc(Ele.parentNode.id).delete();
    Ele.parentNode.remove();
}

let itemName = document.getElementById('itemName');
let price = document.getElementById('price');
let imageUp = document.getElementById('imageUp');
async function addProduct() {
    let currentUser = auth.currentUser;
    let uploadProduct = await db.collection('product').add({
        UID: currentUser.uid,
        itemname: itemName.value,
        price: price.value,
        category: category.value,
        deliverytype: dType.value,
        imageurl: await uploadImageToStorage()
    })
    if (uploadProduct) {
        alert('Product Has Been Uploaded ')
    }

}

async function uploadImageToStorage() {
    let currentUser = auth.currentUser;
    let randomKeys = Math.floor(Math.random() * 100000000000000)
    console.log(randomKeys)
    await db.collection('keys').add({
        keys: randomKeys
    })
    let imageFile = imageUp.files[0];
    let storagePath = await storage.ref().child(`images/${randomKeys}`);
    await storagePath.put(imageFile);
    let URL = await storagePath.getDownloadURL()
    return URL
}
let restUID;
let dataLoadUser1 = document.getElementById('dataLoadUser1');
let dataLoadUser2 = document.getElementById('dataLoadUser2');
let dataLoadUser3 = document.getElementById('dataLoadUser3');
let containerDiv = document.getElementById('containerDiv');

let btnBackId = document.getElementById('btnBackId')

btnBackId.style.display = 'none';
async function dataUserFetch() {

    
    let dataScrub = await db.collection('restaurant').get()
    let rowdiv = document.createElement('div');

    dataScrub.forEach(async function (dataEl) {
        let alldata = dataEl.data();

        rowdiv.className = 'row';
        let div1 = document.createElement('div');
        div1.className = 'col-lg-4  mainBorder'

        let textNodeLi = document.createTextNode(alldata.restaurent)
        div1.innerHTML = ` <i class="fas fa-shopping-basket"></i>  `;
        div1.appendChild(textNodeLi)
        div1.id = alldata.UID
        rowdiv.appendChild(div1)
        containerDiv.appendChild(rowdiv)
        div1.setAttribute('onclick', 'productFetch(this)')
        // divCreate3.appendChild(li);
        
    })

}

// console.log(containerDiv)



let divContPro = document.getElementById('divContPro');
let mainBorder = document.getElementsByClassName('mainBorder')
let propName ,bool = true;

async function productFetch(Element) {

    setTimeout(async () => {
        btnBackId.style.display = 'block';
 
        let rowdiv = document.createElement('div')
        for (let i = 0; i < mainBorder.length; i++ ) {
            let proData = await db.collection('product').get()
            divContPro.querySelectorAll('*').forEach(n => n.remove());
            proData.forEach(function (dataElPro) {
                console.log(dataElPro.data())
                rowdiv.id = 'row';
                // console.log(mainBorder[i])
                if (Element.id === dataElPro.data().UID &&  bool) {
                    containerDiv.style.display = 'none'
                    let productData = dataElPro.data();
                    rowdiv.className = "row";
                    let div1 = document.createElement('DIV');
                    div1.className = "col-lg-4 card divPro ";
                    div1.style.width = "15rem";
                    let createimg = document.createElement("img")
                    createimg.className = "card-img-top cardImg";
                    createimg.src = productData.imageurl;
                    createimg.style.width = "100%";
                    createimg.style.height = "100%";
                    let createdecripdiv = document.createElement("DIV");
                    createdecripdiv.className = "card-body";

                    let paradiv = document.createElement("P");
                    let text = document.createTextNode(productData.itemname);
                    let btn = document.createElement('button');
                    let btnText = document.createTextNode('Order');
                    btn.className = 'btn btn-primary';
                    btn.id = dataElPro.data().UID;
                    btn.setAttribute('onclick', `orderFood(this)`);
                    btn.appendChild(btnText);
                    
                    paradiv.appendChild(text);
                    createdecripdiv.appendChild(paradiv);
                    createdecripdiv.appendChild(btn);
                    div1.append(createimg, createdecripdiv);
                    rowdiv.appendChild(div1);
                    divContPro.appendChild(rowdiv);
                    // propName = productData.itemname;
                    divContPro.style.display = 'block';
                    
                    // for(let o =0; o < mainBorder.length ; o++){
                    //     mainBorder[o];
                    // }
                }
            })
        }
    }, 1000);
    
}



function backBtn(){
    containerDiv.style.display = 'block';
    btnBackId.style.display = 'none';
    divContPro.style.display = 'none';
}


        
async function orderFood(Element, secEle) {

    // console.log(Element.parentNode.lastChild.innerHTML)
    let currentUser = auth.currentUser;

    await db.collection('restaurant').doc(Element.id).collection('order').add({
        resturantUid: Element.id,
        currentUserOrderId: currentUser.uid,
        itemname: Element.parentNode.firstChild.innerHTML,


    })

    setTimeout(() => {
        window.location.replace('yourorder.html')

    }, 1000);
}



function orderDetails(){
    window.location.replace('yourorder.html')
}



function orderDetailsBtnFunc(){
    window.location.replace('userhome.html')
}

let h4Status = document.getElementById('h4Status');

function dataLoadOfOrder(){
    setTimeout(async () => {
        let currentUser = auth.currentUser;
         await db.collection('restaurant').onSnapshot(function(data){
             data.forEach(async function(dataReal){
            //    console.log(dataReal.data().UID)
             await db.collection('restaurant').doc(dataReal.data().UID).collection('order').onSnapshot(function(dataLate){
                dataLate.forEach(async function(dataOns){
                    console.log(dataOns.data())
                   if(dataOns.data()){
                       h4Status.innerHTML = `Status : Pending`
                   }
               })
              
                 
               })
               await db.collection('restaurant').doc(dataReal.data().UID).collection('accepted').onSnapshot(function(dataFate){
                dataFate.forEach(async function(dataOns2){
                    console.log(dataOns2.data())
                    //    console.log(dataOns2.data())
                       if(dataOns2.data()){
                        h4Status.innerHTML = `Status : Accepted`
                    }
                   })
               })
            


               await db.collection('restaurant').doc(dataReal.data().UID).collection('delievered').onSnapshot(function(dataSate){
                dataSate.forEach(async function(dataOns3){
                    console.log(dataOns3.data().itemdel)
                    if(dataOns3.data().itemdel){
                     h4Status.innerHTML = `Status : Delievered`
                 }
                })
                })
                




             })



         })

   




    }, 1000);
}