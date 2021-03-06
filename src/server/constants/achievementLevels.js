module.exports = {
    likes: {
        max: 6,
        levels: [
            {
                price: 5,
                lvl: 0,
                name: "",
            },
            {
                price: 50,
                name: "Начинающий мемолог",
                lvl: 1
            },
            {
                price: 100,
                name: "Профессиональный мемолог",
                lvl: 2
            },
            {
                price: 500,
                name: "Кандидат мемных наук",
                lvl: 3
            },
            {
                price: 1000,
                name: "Лайк-инвестор",
                lvl: 4
            },
            {
                price: 5000,
                name: "Я просто так нажимаю на эту кнопку",
                lvl: 5
            },
            {
                price: 0,
                name: "Press F to pay respect",
                lvl: 6,
                isFinalLevel: true
            },
        ],
        allNames: [
            "",
            "Начинающий мемолог",
            "Профессиональный мемолог",
            "Кандидат мемных наук",
            "Лайк-инвестор",
            "Я просто так нажимаю на эту кнопку",
            "Press F to pay respect"
        ]
    },
    dislikes: {
        max: 6,
        levels: [
            {
                price: 5,
                name: "",
                lvl: 0
            },
            {
                price: 50,
                name: "Хейтер",
                lvl: 1,
            },
            {
                price: 100,
                name: "Одмен - петух",
                lvl: 2
            },
            {
                price: 500,
                name: "Мамкин оппозиционер",
                lvl: 3
            },
            {
                price: 1000,
                name: "Произошел троллинг",
                lvl: 4
            },
            {
                price: 5000,
                name: "Мне нравится злить модераторов",
                lvl: 5
            },
            {
                price: 0,
                name: "Удалите пожалуйста аккаунт. Вы нам не нравитесь",
                lvl: 6,
                isFinalLevel: true,
            },
        ],
        allNames: [
            "",
            "Хейтер",
            "Одмен - петух",
            "Мамкин оппозиционер",
            "Произошел троллинг",
            "Мне нравится злить модераторов",
            "Удалите пожалуйста аккаунт. Вы нам не нравитесь",
        ]
    },
    comments: {
        max: 6,
        levels: [
            {
                price: 5,
                name: "",
                lvl: 0
            },
            {
                price: 15,
                name: "Первонах",
                lvl: 1,
            },
            {
                price: 50,
                name: "15+ см",
                lvl: 2
            },
            {
                price: 100,
                name: "Стендапер",
                lvl: 3
            },
            {
                price: 250,
                name: "Красноречие - 100",
                lvl: 4
            }, {
                price: 500,
                name: "Пишу шутки Поперечному",
                lvl: 5
            }, {
                price: 0,
                name: "Из моих комментов создают мемы",
                lvl: 6,
                isFinalLevel: true,
            },
        ],
        allNames: [
            "",
            "Первонах",
            "20 см",
            "Стендапер",
            "Красноречие - 100",
            "Пишу шутки Поперечному",
            "Из моих комментов создают мемы"
        ]
    },
    views: {
        max: 8,
        levels: [
            {
                price: 50,
                name: "",
                lvl: 0
            },
            {
                price: 250,
                lvl: 1,
                name: "Любитель мемчиков",
            },
            {
                price: 1000,
                lvl: 2,
                name: "Куда я трачу свою жизнь?",
            },
            {
                price: 5000,
                lvl: 3,
                name: "Мемырь",
            },
            {
                price: 10000,
                lvl: 4,
                name: "Ещё 5 минуточек",
            },
            {
                price: 20000,
                lvl: 5,
                name: "Платиновый Мемырь",
            }, {
                price: 50000,
                lvl: 6,
                name: "МемСпейсер",
            },
            {
                price: 100000,
                lvl: 7,
                name: "Мы на страже твоей девственности",
            },
            {
                price: 0,
                lvl: 8,
                name: "Я нашёл свой смысл жизни",
                isFinalLevel: true,
            },
        ],
        allNames: [
            "",
            "Любитель мемчиков",
            "Куда я трачу свою жизнь?",
            "Мемырь",
            "Ещё 5 минуточек",
            "Платиновый Мемырь",
            "МемСпейсер",
            "Мы на страже твоей девственности",
            "Я нашёл свой смысл жизни",
        ]
    },
    favourites: {
        max: 6,
        levels: [
            {
                price: 10,
                lvl: 0,
                name: "",
            }, {
                price: 20,
                lvl: 1,
                name: "Мем-коллекционер",
            }, {
                price: 50,
                lvl: 2,
                name: "К апокалипсису готов",
            }, {
                price: 100,
                lvl: 3,
                name: "Спаси и сохрани",
            }, {
                price: 250,
                lvl: 4,
                name: "Не имей 100 друзей",
            }, {
                price: 500,
                lvl: 5,
                name: "Старейшина",
            }, {
                price: 0,
                lvl: 6,
                name: "Он такой огромный",
                isFinalLevel: true,
            }],
        allNames: [
            "",
            "Мем-коллекционер",
            "К апокалипсису готов",
            "Спаси и сохрани",
            "Не имей 100 друзей",
            "Старейшина",
            "Он такой огромный"
        ]
    },
    referral: {
        max: 2,
        levels: [
            {
                price: 1,
                lvl: 0,
                name: "",
            },
            {
                price: 3,
                lvl: 1,
                name: "Магнит"
            },
            {
                price: 6,
                lvl: 2,
                name: "Экстраверт"
            },
            {
                price: 0,
                lvl: 3,
                name: "Мастер по ноготочкам",
                isFinalLevel: true,
            }
        ],
        allNames: [
            "",
            "Магнит",
            "Экстраверт",
            "Мастер по ноготочками"
        ],
    }
};