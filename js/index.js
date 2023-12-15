const selectFrom = document.querySelector('.currency_select_from');
const selectTo = document.querySelector('.currency_select_to');
const amountInput = document.querySelector('.currency_input');
const convertBtn = document.querySelector('.currency_form');
const btnReverse = document.querySelector('.currency_reverse_btn');
const resultFrom = document.querySelector('.currency_result_from');
const resultTo = document.querySelector('.currency_result_to');
const showResults = document.querySelector('.currency_results');


const defaults = {
    link: 'https://v6.exchangerate-api.com/v6/472ce8adeab4a47cfd9285c3',
    codesFrom: [],
    codesTo: [],
    pair: {
        from: '',
        to: ''
    },
    amount: ''
}

const getFullTitle = (codes, code) => {
    const [ , title] = codes.find((item) => item.includes(code));
    return title;
}

const currencyReverse = (e) => {
    e.preventDefault();

    const { pair: { from, to } } = defaults;

    defaults.pair = {
        from: to,
        to: from
    }

    selectFrom.value = to;
    selectTo.value = from;
};

const handleFrom = ({ target: { value } }) => {
    defaults.pair = {
        ...defaults.pair,
        from: value
    }
};

const handleTo = ({ target: { value } }) => {
    defaults.pair = {
        ...defaults.pair,
        to: value
    }
};

const handleInput = ({ target: { value } }) => {
    defaults.amount = Number(value);
};

const insertResults = ({ base_code: baseCode, target_code: targetCode, conversion_result: result}) => {
    const from = {
        name: baseCode,
        fullName: getFullTitle(defaults.codesFrom, baseCode),
        amount: defaults.amount
    }

    const to = {
        name: targetCode,
        fullName: getFullTitle(defaults.codesTo, targetCode),
        amount: result
    }

    resultFrom.innerHTML = `
        <div class="result_body">
            <div class="body_text">
                <div class="result_title">${from.name}</div>
                <div class="result_text">${from.fullName}</div>
            </div>
            <div class="result_amount">${from.amount.toFixed(2)}</div>
        </div>
    `;

    resultTo.innerHTML = `
        <div class="result_body">
            <div class="body_text">
                <div class="result_title">${to.name}</div>
                <div class="result_text">${to.fullName}</div>
            </div>
            <div class="result_amount">${to.amount.toFixed(2)}</div>
        </div>
    `;

    showResults.style.display = 'flex';
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const { link, pair: { from, to }, amount } = defaults;

    if (!from || !to || !amount) return;

    try {
        const responce = await fetch(`${link}/pair/${from}/${to}/${amount}`);
        const data = await responce.json();
        
        if (data.result === 'success') {
            insertResults(data);
        }

    } catch (err) {
        console.log(err);
    } 
};

const renderCodeList = () => {
    defaults.codesFrom.forEach(([code]) => {
        const element = document.createElement('option');
        element.value = code;
        element.innerHTML = code;
        selectFrom.appendChild(element);
    });

    selectFrom.addEventListener('change', handleFrom);

    defaults.codesTo.forEach(([code]) => {
        const element = document.createElement('option');
        element.value = code;
        element.innerHTML = code;
        selectTo.appendChild(element);
    });

    selectTo.addEventListener('change', handleTo);
};

const fetchCodes = async () => {
    try {
        const responce = await fetch(`${defaults.link}/codes`);
        const data = await responce.json();

        defaults.codesFrom = data.supported_codes;
        defaults.codesTo = data.supported_codes;
        renderCodeList();
    } catch (err) {
        console.log(err);
    }
};

fetchCodes();

amountInput.addEventListener('keyup', handleInput);
convertBtn.addEventListener('submit', handleSubmit);
btnReverse.addEventListener('click', currencyReverse);