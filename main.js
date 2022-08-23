"use strict";

// variables
const screenW = document.querySelector('.scrn').clientWidth;
let input = document.getElementById('input');
const btnKey = document.querySelectorAll('.key');
const oprt = document.querySelectorAll('.oprt');
const prevResult = document.getElementById('prev-result');
const btnOpenHis = document.getElementById('btn-open-rcord');
const btnClosedHis = document.getElementById('btn-close');
const record = document.getElementById('elements');
const btnTlsHddn = document.querySelector('.down');
const btnCH = document.getElementById('btn-clean');
const flash = document.querySelector('.flash').style;
let operator = [],
    num = [],
    I = 0,
    trim = false,
    hisDlt = [];


// keys
btnKey.forEach(btn =>{
    btn.addEventListener('click',e=>{
        let newKey = e.target.id;
        newOpr();
        if (num[I] == undefined){
            num[I] = '0';
        };
        let opL = operator[operator.length-1];
        trim = opL !== undefined && opL.endsWith('rt') ? true : false;
        input.innerHTML += operator[I-1] !== 'xpY' ? newKey : `<sup>${newKey}</sup>`;
        bigOperation();
        num[I] += newKey;
        operator.length >= 2
            ? operate(operator[I-1],prevResult.innerText,num[I])
            : operate(operator[0]);
        responsiveResult(input,1.5,3);
    })
})
document.getElementById('pi').addEventListener('click',()=>{
        newOpr();
        input.innerHTML += `<i class="ico-tx ico-pi" style="width: 7vh; height: 7vh;"></i>`;
        num[I] == undefined ? num[I] = '03.141592653589793' : num[I] += '3.141592653589793';
        if (operator[0] == undefined) prevResult.innerText += '3.141592653589793';
        operator.length >= 2
            ? (operate(operator[I-1],prevResult.innerText,num[I]))
            : operate(operator[0]);
        responsiveResult(input,1.5,3);
})
// opertors
oprt.forEach(btn=>{
    btn.addEventListener('click',e=>{
        let type = e.target.classList[0];
        let clss = e.target.className;
        let newOprt = e.target.id;
        if (prevResult.id == 'result'){
            flash.animation = '';
            prevResult.setAttribute('id','prev-result');
            prevResult.style.fontSize = '4vh';
            type.endsWith('rt') 
                ? (clearData(),
                   prevResult.innerHTML = '')
                : (num[0] = prevResult.innerText,
                   input.innerText += prevResult.innerText+'00',
                   I++)
        }
        if (clss.includes('trim')){     // root
            operator[I] = type;
            trim = clss.includes('rt') ? true : (false, I++);
            input.innerHTML += clss.includes('container-ico')
                ? type == 'sqrt'
                    ? `<i class="ico-tx ico-rt" style="width: 7vh; height: 7vh;"></i>` 
                    : `<span><sup>3</sup><i class="ico-tx ico-rt" style="width: 7vh; height: 7vh;"></i></span>`
                : newOprt;
        } else if (type == 'xp'){       // potenciar
            input.innerHTML += `<span>^<sup>2</sup></span> `;
            operator[I] = type;
            operator.length >= 2
                ? (bigOperation(),
                   operate(operator[I-1],prevResult.innerText,num[I]**2))
                : operate(operator[0]);
            I++;
        } else if (num[I] == undefined && operator[I-1] !== 'xp'){      // replace operator
            let str = input.innerText;
            input.innerText = str.slice(0,str.length-2);
            input.textContent += ` ${newOprt} `;
            operator[I-1] = type;
        } else {        // basic operator
            operator[I] = type;
            input.innerHTML += ` ${newOprt} `;
            I++;
        }
    })
})
//      special keys
document.querySelector('.gtRs').addEventListener('click',()=>{      // get result
    if (prevResult.id !== 'result' && prevResult.innerHTML !== ''){
        if (record.firstElementChild == document.querySelector('.empty-record')){
            record.removeChild(record.firstElementChild);
            record.classList.remove('empty');
            btnCH.classList.replace('close','open');
        }
        addOperacion({
            process: input.innerHTML,
            result : prevResult.innerText
        });
        prevResult.setAttribute('id','result');
        prevResult.style.fontSize = '11vh';
        clearData();
        flash.animation = 'flash 1s ease-out forwards';
        responsiveResult(document.getElementById('result'),0.5,4.5);
    }
})
document.querySelector('.clr').addEventListener('click',()=>{       // clean screen
    prevResult.innerText = '';
    clearData();
})
document.querySelector('.dlt').addEventListener('click',()=>{   // delete
    let val = input.innerHTML;
    let pR = hisDlt[hisDlt.length-2];
    if (val[val.length-1] === ' '){     // delete operator
        input.innerHTML = val.substring(0,val.length-3);
        operator.pop();
        I--;
    } else if (val[val.length-1] == '>'){     // delete pi
        prevResult.innerText = pR;
        input.lastElementChild.classList[1] == 'ico-pi'
            ? (num[I] = num[I]-3.141592653589793,
               hisDlt.pop())
            : operator.pop();
        input.removeChild(input.lastElementChild);
    } else {     // delete number
        input.innerHTML = val.substring(0,val.length-1);
        num[I] = num[I].toString().substring(0,num[I].length-1);
        hisDlt[hisDlt.length-1] !== undefined 
            ? (prevResult.innerText = pR,
               trim = operator[operator.length-1].endsWith('rt') ? true : false,
               hisDlt.pop())
            : prevResult.innerText = '';


    }
})
// functions
const operate = (type,nI=num[0],nII=num[1]) =>{
    let r = prevResult;
    if (trim){
        let opr = input.innerHTML.split(' ');
        let rz = opr[opr.length-1].split('>');
        num[I] = operator[I] == 'sqrt' ? Math.sqrt(rz[rz.length-1]) : Math.cbrt(rz[rz.length-1]);
        trim = false;
        return operator.length == 1
            ? r.innerText = num[I]
            : operator.length > 2 
                ? operate(operator[I-1],r.innerText,num[I])
                : operate(operator[I-1],num[I-1],num[I]);
    }
    switch (type) {
        case 'addUp': r.innerText = parseFloat(nI) + parseFloat(nII);
        break;
        case 'subtr': r.innerText = parseFloat(nI) - parseFloat(nII);
        break;
        case 'mlt': r.innerText = operator.length < 2 || operator[1].endsWith('rt')
            ? parseFloat(num[I-1]) * parseFloat(num[I])
            : operator.length >= 3
                ? mlt(operator[I-2],hisDlt[I-2])
                : mlt(operator[0],num[I-2]);
        break;
        case 'split':  r.innerText = operator.length < 2 || operator[1].endsWith('rt')
            ? parseFloat(num[I-1]) / parseFloat(num[I])
            : operator.length >= 3
                ? splt(operator[I-2],hisDlt[I-2])
                : splt(operator[0],num[I-2]);
        break;
        case 'prct': r.innerText = nII != '00' 
            ? parseFloat(nI) * parseFloat(nII) / 100 
            : '0';
        break;
        case 'xp': r.innerText = parseFloat(nI)**2;
        break;
        case 'xpY': r.innerText = parseFloat(nI)**parseFloat(nII);
    }
    r.innerText == 'NaN' || r.innerText == 'undefined'
        ? (r.innerHTML = `<span class="error">error</span>`)
        : hisDlt.push(r.innerHTML);
}
const bigOperation = ()=>{
    let oprt = operator[I-1];
    if (oprt == 'addUp' || oprt == 'xp'){
        prevResult.innerText = parseFloat(prevResult.innerText)-parseFloat(num[I]);
    } else if (oprt == 'subtr'){
        prevResult.innerText = parseFloat(prevResult.innerText)+parseFloat(num[I]);
    } else if (oprt == 'mlt' && num[I] !='0'){
        prevResult.innerText = parseFloat(prevResult.innerText)/parseFloat(num[I]);
    } else if (oprt == 'splt' && num[I] !='0'){
        prevResult.innerText = parseFloat(prevResult.innerText)*parseFloat(num[I]);
    } 
}

const splt = (sr,n)=>{
    switch (sr) {
        case 'addUp': return parseFloat(n) + (parseFloat(num[I-1]) / parseFloat(num[I]));
        case 'subtr': return parseFloat(n) - (parseFloat(num[I-1]) / parseFloat(num[I]));
        default: return 'no soported'; 
}}
const mlt = (sr,n)=>{
    switch (sr) {
        case 'addUp': return parseFloat(n) + (parseFloat(num[I-1]) * parseFloat(num[I]));
        case 'subtr': return parseFloat(n) - (parseFloat(num[I-1]) * parseFloat(num[I]));
        default: return 'no soported';
}}
const newOpr = ()=>{
    if (prevResult.id == 'result'){
        flash.animation = '';
        prevResult.innerText = '';
        prevResult.setAttribute('id','prev-result');
        prevResult.style.fontSize = '4vh';
    }
}
const clearData = ()=>{
    input.innerText = '';
    num = [];
    I = 0;
    operator = [];
    hisDlt = [];
    input.style.fontSize = '9vh';
};
const responsiveResult = (element,val,max)=>{
    let stl = element.style;
    let fS = stl.fontSize.split('v')[0];
    if (element.clientWidth >= screenW-29 && fS > max){
        stl.fontSize = `${fS-val}vh`;
        document.querySelectorAll('.ico-tx').forEach(ico=>{
            let sz = ico.style.width.split('v')[0];
            if (sz >= 3){
                ico.style.width = `${sz-val}vh`;
                ico.style.height = `${sz-val}vh`;
            }
        })
        responsiveResult(element,val,max);
    }
};

// record (database)
const IDBrequest = indexedDB.open('database',1);
IDBrequest.addEventListener('upgradeneeded',()=>{
    let db = IDBrequest.result;
    db.createObjectStore('record',{
        autoIncrement: true
    })
})
IDBrequest.addEventListener('success',()=>{
    readRecord();
    responsiveH();
})
const getTransaction = ()=>{                                   
    const db = IDBrequest.result;
    const IDBtransaction = db.transaction("record",'readwrite');
    const objectStore = IDBtransaction.objectStore("record");
    return objectStore;   
}
const addOperacion = element =>{
    const IDBdata = getTransaction();
    IDBdata.add(element);
    createElement(element.process,element.result);
}
const readRecord = ()=>{
    const IDBdata = getTransaction();
    let cursor = IDBdata.openCursor();
    cursor.addEventListener('success',()=>{
        cursor.result
            ? (createElement(cursor.result.value.process,cursor.result.value.result),
               record.scroll(0,record.scrollHeight),
               cursor.result.continue())
            : record.childElementCount == 0 
                ? (msgHis(), btnCH.classList.add('close')) 
                :  btnCH.classList.add('open');
    })
}
const cleanRecord = ()=>{
    const IDBdata = getTransaction();
    let cursor = IDBdata.openCursor();
    cursor.addEventListener('success',()=>{
        if (cursor.result){
            IDBdata.delete(cursor.result.key);
            cursor.result.continue();
        }
    })
}
const createElement = (pros,res)=>{
            const element = document.createElement('DIV');
            const pro = document.createElement('H4');
            const result = document.createElement('H3');
            element.classList.add('element');
            pro.classList.add('process');
            result.classList.add('result');
            pro.innerHTML = pros;
            result.innerText = res;
            element.appendChild(pro);
            element.appendChild(result);
            result.style.maxWidth = `${record.clientWidth-34}px`;
            record.appendChild(element);
            record.scroll(0,record.scrollHeight);
}
const msgHis = ()=>{
    const msg = document.createElement('H5');
    msg.textContent = 'Sin Historial!';
    msg.classList.add('empty-record');
    record.classList.add('empty');
    record.appendChild(msg);
}
btnCH.addEventListener('click',()=>{
    cleanRecord();
    record.innerHTML = '';
    msgHis();
    btnCH.classList.replace('open','close');
})
const responsiveH = ()=>{
    let cH = document.querySelector('.container-record').style;
    let sz = document.querySelector('.container-calculated').clientWidth;
    return window.innerWidth < 450
        ? cH.maxWidth = `${sz}px`
        : cH.maxWidth = `${window.innerWidth-sz}px`;
}
window.addEventListener('resize',()=>{
    responsiveH();
    document.querySelectorAll('.result').forEach(element=>{
        element.style.maxWidth = `${record.clientWidth}px`;
    })
})
// desplay historial
let transY = 40;
let opa = 5;
btnOpenHis.addEventListener('drag',()=>{
    let record = document.querySelector('.container-record');
    record.style.transform = `translateY(-${transY*2}%)`;
    record.style.opacity = `${opa/100}`;
    transY--;
    opa+=7;
})
btnOpenHis.addEventListener('dragend',()=>{
    let record = document.querySelector('.container-record');
    transY < 25 
        ? (record.style.transform = `translateY(0)`,
           record.style.opacity = `1`,
           transY = 0,
           opa = 100)
        : (record.style.transform = 'translateY(-100%)',
           record.style.opacity = `0`,
           transY = 40,
           opa = 5);
})
btnClosedHis.addEventListener('drag',()=>{
    let record = document.querySelector('.container-record');
    record.style.transform = `translateY(-${transY*2}%)`;
    record.style.opacity = `${opa/100}`
    transY++;
    opa-=7;
})
btnClosedHis.addEventListener('dragend',()=>{
    let record = document.querySelector('.container-record');
    transY > 15 
        ? (record.style.transform = `translateY(-100%)`,
           record.style.opacity = `0`,
           transY = 40,
           opa = 5)
        : (record.style.transform = 'translateY(0)',
           record.style.opacity = `1`,
           transY = 0,
           opa = 100);
})
// tools hidden
btnTlsHddn.addEventListener('click',()=>{
    if (btnTlsHddn.classList[1] == 'down'){
        let bar = document.querySelector('.keyboard-hddn');
        document.querySelectorAll('.show').forEach(btn =>{
            btn.classList.replace('show','hddn');
        });
        bar.classList.replace('keyboard-hddn','keyboard-II');
        btnTlsHddn.classList.replace('down','up');
    } else hdIII();
})
document.querySelectorAll('.btn-hddn').forEach(btn =>{
    btn.addEventListener('click',()=>{
        hdIII();
    })
})
const hdIII = ()=>{
    let bar = document.querySelector('.keyboard-II');
    document.querySelectorAll('.hddn').forEach(btn =>{
        btn.classList.replace('hddn','show');
    });
    bar.classList.replace('keyboard-II','keyboard-hddn');
    btnTlsHddn.classList.replace('up','down');
}