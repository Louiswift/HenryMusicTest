const input = document.querySelector('.search');
const ul = document.querySelector("#list");
let searchValue = getParameterByName("search");
const popularSearches = document.querySelector('.popularSearches-History');

if (!searchValue) {
    getNewSong().then(async resp => {
        let list = [];
        let songs = resp.result;
        await improveSongInformation(list, songs)
        creatList(list);
        addDblClickEventListener(ul, audio, playMain, list)
    });
}


input.addEventListener('keydown', (event) => {
    if (event.key == "Enter") {
        if (input.value !== ' ') {
            let searchHistory = JSON.parse(localStorage.getItem('SearchHistory')) || [];
            searchHistory.push(input.value)
            localStorage.setItem('SearchHistory', input.value);
            localStorage.setItem('SearchHistory', JSON.stringify(searchHistory));
            window.location.href = `search.html?search=${input.value}`;
        }
    }
});

// 鼠标聚焦搜索框
input.addEventListener('focus', () => {
    popularSearches.style.display = 'block';
});

input.addEventListener('blur', () => {
    popularSearches.style.display = 'none';
});

// 搜索历史
const searchHistoryWrap = document.querySelector("#searchHistory");
let searchHistory = JSON.parse(localStorage.getItem('SearchHistory'));

for (let i = 0; i < searchHistory.length; i++) {
    let li = document.createElement("li");
    li.innerText = searchHistory[i];
    searchHistoryWrap.appendChild(li);
}

// 点击按钮清除历史搜索
const clearBtn = document.querySelector(".clearbtn");
clearBtn.addEventListener('click', () => {
    localStorage.removeItem('SearchHistory');
    searchHistoryWrap.innerText = '';
})

// 热门搜索
const hotHistoryWrap = document.querySelector("#hotSearch");

hotSearch().then(resp => {
    for (let i = 0; i < resp.data.length; i++) {
        let li = document.createElement("li");
        li.innerText = resp.data[i].searchWord;
        hotHistoryWrap.appendChild(li);
    }
});

// 鼠标点击历史搜索 or 热门搜索的内容 进行搜索
popularSearches.addEventListener('click', (event) => {
    let li = event.target.closest("li");
    if (!li) return;
    if (!popularSearches.contains(li)) return;
    window.location.href = `search.html?search=${event.target.innerText}`;
})

if (searchValue !== null) {
    search(searchValue).then(async resp => {
        let list = [];
        const songs = resp.result.songs;
        await improveSongInformation(list, songs)
        creatList(list);
        await addDblClickEventListener(ul, audio, playMain, list)
    });
}