const storyText = document.getElementById('story-text');
const optionsDiv = document.getElementById('options');
const storyTitle = document.getElementById('story-title');
const characterImage = document.getElementById('character-image');
const restartButton = document.getElementById('restart-button');
const backButton = document.getElementById('back-button');

const story = {
    start: {
        text: "Вы находитесь в темном лесу. Куда вы хотите пойти?",
        options: [
            { text: "Пойти налево", next: "leftPath" },
            { text: "Пойти направо", next: "rightPath" },
        ],
        image: "",
        history: []
    },
    leftPath: {
        text: "Вы встретили мудрого старца. Он предлагает вам выбор.",
        options: [
            { text: "Спросить о дороге", next: "askOldMan" },
            { text: "Игнорировать и идти дальше", next: "ignoreOldMan" },
        ],
        image: "images/old_man.png",
        history: ["start"]
    },
    rightPath: {
        text: "Вы наткнулись на опасного монстра. Что делать?",
        options: [
            { text: "Сразиться с монстром", next: "fightMonster" },
            { text: "Убежать", next: "runAway" },
        ],
        image: "images/monster.png",
        history: ["start"]
    },
    askOldMan: {
        text: "Старец рассказывает вам о скрытом сокровище. Вы нашли подсказку!",
        options: [
            { text: "Спасибо, я пойду искать сокровище", next: "treasureHunt" },
            { text: "Я не верю ему и ухожу", next: "ignoreOldMan" },
        ],
        image: "images/old_man.png",
        history: ["leftPath"]
    },
    ignoreOldMan: {
        text: "Вы потерялись в лесу. Игра окончена.",
        options: [],
        image: "",
        end: true,
        history: ["leftPath"]
    },
    fightMonster: {
        text: "Вы победили монстра, но получили ранения. Вам нужно отдохнуть.",
        options: [
            { text: "Использовать зелье", next: "usePotion" },
            { text: "Попробовать продолжить", next: "continueJourney" }
        ],
        image: "images/monster.png",
        history: ["rightPath"]
    },
    usePotion: {
        text: "Вы восстановились и готовы продолжить свой путь! Вы стали сильнее.",
        options: [
            { text: "Пойти налево", next: "leftPath" },
            { text: "Пойти направо", next: "rightPath" }
        ],
        image: "images/hero.png",
        history: ["fightMonster"]
    },
    continueJourney: {
        text: "Вы не смогли продолжать и упали. Игра окончена.",
        options: [],
        image: "",
        end: true,
        history: ["fightMonster"]
    },
    treasureHunt: {
        text: "Вы нашли сокровище и стали богатым человеком! Игра окончена.",
        options: [],
        image: "images/hero.png",
        end: true,
        history: ["askOldMan"]
    }
};

let history = [];

function startGame() {
    const savedStory = localStorage.getItem('currentStory');
    if (savedStory) {
        showStory(savedStory);
    } else {
        showStory('start');
    }
}

function showStory(storyKey) {
    const currentStory = story[storyKey];
    storyTitle.innerText = "Интерактивная Новелла";
    storyText.innerText = currentStory.text;
    optionsDiv.innerHTML = '';
    characterImage.src = currentStory.image;
    characterImage.style.display = currentStory.image ? 'block' : 'none';
    restartButton.style.display = currentStory.end ? 'block' : 'none';
    backButton.style.display = history.length > 0 ? 'block' : 'none';

    currentStory.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.onclick = () => {
            history.push(storyKey);
            localStorage.setItem('currentStory', option.next);
            showStory(option.next);
        };
        optionsDiv.appendChild(button);
    });

    if (currentStory.end) {
        restartButton.onclick = () => restartGame();
    }
}

function restartGame() {
    localStorage.removeItem('currentStory');
    history = [];
    startGame();
}

backButton.onclick = () => {
    if (history.length > 0) {
        const lastStory = history.pop();
        localStorage.setItem('currentStory', lastStory);
        showStory(lastStory);
    }
};

startGame();