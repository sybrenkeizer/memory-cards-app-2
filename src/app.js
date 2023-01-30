//! BUGS
// - Select dropdown menu section navigation on enter remains focussed
// - Fix algorithm for btn evaluation 'hard'

//! ANOMALY
// - First card in card slider (class = prev) takes on unintended the value of active card
// - Exit section button hover has glitches other form elements

// TODO : Add methods to deck controller to deal with data updates
// TODO : Trim UI selectors
// TODO : Join all cardslider event listeners together?
// TODO : Make UI responsive 
// TODO : Make UI mobile responsive 



// STORAGE CONTROLLER
const StorageCtrl = (function () {

	return {
		storeDeck: (deck) => {
			let decks;
			if (localStorage.getItem('decks') === null) {
				decks = [];
				decks.push(deck);
				localStorage.setItem('decks', JSON.stringify(decks));
			} else {
				decks = JSON.parse(localStorage.getItem('decks'));
				decks.push(deck);
				localStorage.setItem('decks', JSON.stringify(decks));
			}
		},
		editDeck: (newDeck) => {
			let decks = JSON.parse(localStorage.getItem('decks'));
			let deckIndex = decks.findIndex(deck => deck.id === newDeck.id);
			decks.splice(deckIndex, 1, newDeck)
			localStorage.setItem('decks', JSON.stringify(decks));
		},
		deleteDeck: (deckName) => {
			const decks = JSON.parse(localStorage.getItem('decks'));
			const removeIndex = decks.findIndex(deck => deck.name === deckName);
			decks.splice(removeIndex, 1);
			localStorage.setItem('decks', JSON.stringify(decks));
		}
	}
})();

// DECK CONTROLLER
const DeckCtrl = (function () {
	const Deck = function(id, name) {
		this.id = id;
		this.name = name;
		this.cards = [];
	}
	const Card = function(id, question, answer) {
		this.id = id;
		this.question = question;
		this.answer = answer;
	}
	const data = {
		activeDeck: [],
		activeCard: 0,
		activeCardID: 0,
	}

	return {
		createID: () => {
			let date = new Date();
			let ID =
				String(date.getFullYear()) +
				String(date.getMonth()) +
				String(date.getDay()) +	
				String(date.getHours()) +
				String(date.getMinutes()) +
				String(date.getSeconds()) +
				String(date.getMilliseconds());
			return ID;
		},
		addDeck: (name) => {
			let ID = DeckCtrl.createID();
			newDeck = new Deck(ID, name);
			data.activeDeck = newDeck;
			return newDeck;
		},
		addCard: (question, answer) => {
			let ID = DeckCtrl.createID();
			newCard = new Card(ID, question, answer);
			data.activeDeck.cards.unshift(newCard);
			return newCard;
		},
		deleteCard: (deck, id) => {
			const cards = deck.cards;
			cards.forEach((card, index) => card.id === id && cards.splice(index, 1));
		},
		clearData: function() {
			data.activeDeck = null;
			data.activeCard = 0;
			data.activeCardID = 0;
		},
		logData: () => data
	}
})();


// UI CONTROLLER
const UICtrl = (function () {
	// TODO: Simplify DOM selectors
	const UISelectors = {
		cube: ".cube",
		mainSection: ".cube__side--main",
		createSection: ".cube__side--create",
		editSection: ".cube__side--edit",
		practiceSection: ".cube__side--practice",
		statisticsSection: ".cube__side--statistics",
		exitSectionBtn: ".section__exit-btn",
		msInputFields: "#form__main-menu .form-control > *:first-child",
		msPracticeSectionBtn: "#practice-deck__btn",
		msPracticeSectionMenu: '#practice-deck__menu',
		msCreateSectionBtn: "#create-deck__btn",
		msCreateSectionInp: '#create-deck__name',
		msEditSectionBtn: "#edit-deck__btn",
		msEditSectionMenu: '#edit-deck__menu',
		msDeleteDeckBtn: '#delete-deck__btn',
		msDeleteDeckMenu: '#delete-deck__menu',
		msStatisticsSectionBtn: "#statistics-deck__btn",
		msStatisticsSectionMenu: '#statistics-deck__menu',
		csCreateDeckNameInp: "#create-deck__name-input",
		csDeckNameSectionTitle: "#create-deck-name",
		csAddCardBtn: '#cs-add-card-btn',
		csEditCardBtn: '#cs-edit-card-btn',
		csCardQuestionInp: '#create-deck__question',
		csCardAnswerInp: '#create-deck__answer',
		csCardSlider: '#create-deck__cards-slider',
		csCardNavBtnRight: '#cs-card-nav__right',
		csCardNavBtnLeft: '#cs-card-nav__left',
		csCardSliderIndexInp: '#cs-card-nav__index-input',
		csCardSliderIndexLab: '#cs-card-nav__index-label',
		csCardActiveInner: '#create-deck__cards-slider .card.active .card__inner',
		csCardActiveFront: '#create-deck__cards-slider .card.active .card-question-text',
		csCardActiveBack: '#create-deck__cards-slider .card.active .card-answer-text',
		csCardActiveDeleteBtn: '#create-deck__cards-slider .card.active .delete-card-btn',
		csStoreDeckBtn: '#store-deck-btn',
		esDeckNameSectionTitle: '#edit-deck-name',
		esEditDeckNameInp: "#edit-deck__name-input",
		esCardSlider: '#edit-deck__cards-slider',
		esCardNavBtnRight: '#es-card-nav__right',
		esCardNavBtnLeft: '#es-card-nav__left',
		esAddCardBtn: '#es-add-card-btn',
		esEditCardBtn: '#es-edit-card-btn',
		esCardQuestionInp: '#edit-deck__question',
		esCardAnswerInp: '#edit-deck__answer',
		esCardSliderIndexInp: '#es-card-nav__index-input',
		esCardSliderIndexLab: '#es-card-nav__index-label',
		esCardActiveFront: '#edit-deck__cards-slider .card.active .card-question-text',
		esCardActiveBack: '#edit-deck__cards-slider .card.active .card-answer-text',
		esCardActiveInner: '#edit-deck__cards-slider .card.active .card__inner',
		esCreateDeckNameInp: "#edit-deck__name-input",
		esSaveChangesBtn: '#save-changes-btn',
		psDeckNameSectionTitle: '#practice-deck-name',
		psProgressCounterCurrent:'.progress__counter-current',
		psProgressCounterTotal:'.progress__counter-total',
		psProgressBar: '.progress__bar-inner',
		psCardSlider: '#practice-deck__cards-slider',
		psEvalCardContainer: '.card-evaluation',
		psEvalCardEasyBtn: '#card-evaluation--easy',
		psEvalCardOkBtn: '#card-evaluation--ok',
		psEvalCardHardBtn: '#card-evaluation--hard',
		psFinishPracticeContainer: '.finish-deck',
		psFinishPracticeBtn: '#finish-practice-btn'
	};
	
	return {
		// General methods
		getSelectors: () => UISelectors,
		clearInpVal: (element) => element.value = '',
		flipCardFront: (card) => {
			card.style.transform = 'rotate(0)';
		},
		flipCardBack: (card) => {
			card.style.transform = 'rotateX(180deg)';
		},
		navigatePracticeSection: (e) => {
			const cube = UISelectors.cube;
			document.querySelector(cube).style.transform = "rotateX(-90deg)";
		},
		navigateCreateSection: (e) => {
			const cube = UISelectors.cube;
			document.querySelector(cube).style.transform = "rotateY(-90deg)";
		},
		navigateEditSection: (e) => {
			const cube = UISelectors.cube;
			document.querySelector(cube).style.transform = "rotateY(90deg)";
		},
		navigateStatisticsSection: (e) => {
			const cube = UISelectors.cube;
			document.querySelector(cube).style.transform = "rotateX(90deg)";
		},
		navigateMainSection: () => {
			const cube = UISelectors.cube;
			document.querySelector(cube).style.transform = "rotate(0)";
		},
		addDeckToSelectMenu: (menu) => {
			let decks = JSON.parse(localStorage.getItem('decks'));
			const menuEL = document.querySelector(menu);
			Array.from(menuEL.children).forEach((option, index) => (index > 0) && option.remove());
			decks.forEach(deck => {
				const option = document.createElement('OPTION');
				option.value = deck.name;
				option.textContent = deck.name;
				menuEL.appendChild(option);
			});
		},
		resetSelectMenu: (menu) => {
			menu.selectedIndex = 0;
		},

		// Create Section methods
		csPrintTitle: (deckName) => {
			const titleEL = document.querySelector(UISelectors.csDeckNameSectionTitle);
			titleEL.textContent = deckName;
		},
		csPrintDeckName: (deckName) => {
			const deckNameInp = document.querySelector(UISelectors.csCreateDeckNameInp);
			deckNameInp.value = deckName;
		},
		csUpdateSectionTitle: (deckName) => {
			const titleEl = document.querySelector(UISelectors.csDeckNameSectionTitle);
			titleEl.textContent = deckName;
		},
		csPrintQuestion: (e) => {
			const MAX_Q_LENGTH = 80;
			let questionInput = document.querySelector(UISelectors.csCardQuestionInp).value;
			let questionOutput = document.querySelector(UISelectors.csCardActiveFront);
			questionInput.length > MAX_Q_LENGTH
				? questionOutput.textContent = questionInput.substring(0, MAX_Q_LENGTH) + '...'
				: questionOutput.textContent = questionInput;
		},
		csPrintAnswer: (e) => {
			const MAX_A_LENGTH = 80;
			let answerInput = document.querySelector(UISelectors.csCardAnswerInp).value;
			let answerOutput = document.querySelector(UISelectors.csCardActiveBack);
			answerInput.length > MAX_A_LENGTH
				? answerOutput.textContent = answerInput.substring(0, MAX_A_LENGTH) + '...'
				: answerOutput.textContent = answerInput;
		},
		csClearActiveCardFront: () => {
			document.querySelector(UISelectors.csCardActiveFront).textContent = '';
		},
		csClearActiveCardBack: () => {
			document.querySelector(UISelectors.csCardActiveBack).textContent = '';
		},
		csFocusQuestionInpEl: () => {
			document.querySelector(UISelectors.csCardQuestionInp).focus();
		},
		csCreateCardUI: () => {
			const cardsSlider = document.querySelector(UISelectors.csCardSlider);
			const div = document.createElement('DIV');
			div.className = 'card';
			div.innerHTML = `
				<div class="card__inner">
					<div class="card__inner--front">
						<p class="card-question-text">${newCard.question}</p>
						<button class="delete-card-btn">x</button>
					</div>
					<div class="card__inner--back">
						<p class="card-answer-text">${newCard.answer}</p>
						<button class="delete-card-btn">x</button>
					</div>
				</div>
			`;
			cardsSlider.prepend(div);
		},
		//! Generalize function ?
		csSortCardsUI: (deck) => {
			const deckLength = deck.cards.length;
			const cards = document.querySelector(UISelectors.csCardSlider).children;
			deckLength > 0 && (cards[0].className = 'card prev');
			deckLength > 0 && (cards[1].className = 'card active');
			deckLength > 0 && (cards[2].className = 'card first');
			deckLength > 1 && (cards[3].className = 'card second');
			deckLength > 2 && (cards[4].className = 'card third-and-up');
		},
		csShowDeckNav: () => {
			const cardNavBtnRight = document.querySelector(UISelectors.csCardNavBtnRight);
			const cardNavBtnLeft = document.querySelector(UISelectors.csCardNavBtnLeft);
			const cards = DeckCtrl.logData().activeDeck.cards;
			const activeCard = DeckCtrl.logData().activeCard;
			cards.length > activeCard
				? cardNavBtnRight.classList.add('show')
				: cardNavBtnRight.classList.remove('show');
			activeCard > 0
				? cardNavBtnLeft.classList.add('show')
				: cardNavBtnLeft.classList.remove('show');
		},
		csShowNextCard: () => {
			const cardsEls = Array.from(document.querySelector(UISelectors.csCardSlider).children);
			const activeCard = DeckCtrl.logData().activeCard;
			cardsEls.forEach((child, index) => {
				if (child.classList.contains('card-nav')) return;
				index === 3 + activeCard && (child.className = 'card second');
				index === 2 + activeCard && (child.className = 'card first');
				index === 1 + activeCard && (child.className = 'card active');
				index === 0 + activeCard && (child.className = 'card prev');
			});
		},
		csShowPrevCard: () => {
			let cardsEls = Array.from(document.querySelector(UISelectors.csCardSlider).children);
			let activeCard = DeckCtrl.logData().activeCard;
			cardsEls.forEach((child, index) => {
				if (child.classList.contains('card-nav')) return;
				index === 4 + activeCard && (child.className = 'card third-and-up');
				index === 3 + activeCard && (child.className = 'card second');
				index === 2 + activeCard && (child.className = 'card first');
				index === 1 + activeCard && (child.className = 'card active');
				index === 0 + activeCard && (child.className = 'card prev');	
			});
		},
		csDisplayCardInInputFields: () => {
			const activeDeck = DeckCtrl.logData().activeDeck;
			const activeCard = DeckCtrl.logData().activeCard;
			const questionInputEl = document.querySelector(UISelectors.csCardQuestionInp);
			const answerInputEl = document.querySelector(UISelectors.csCardAnswerInp);
			if (activeCard > 0) {
				const question = activeDeck.cards[activeCard - 1].question;
				const answer = activeDeck.cards[activeCard - 1].answer;
				questionInputEl.value = question;
				answerInputEl.value = answer;
			} else if (activeCard === 0) {
				questionInputEl.value = '';
				answerInputEl.value = '';
				questionInputEl.focus();
			};
		},
		csShowEditCardBtn: () => {
			const activeCard = DeckCtrl.logData().activeCard
			if (activeCard > 0) {
				document.querySelector(UISelectors.csAddCardBtn).classList.remove('show');
				document.querySelector(UISelectors.csEditCardBtn).classList.add('show');
			}
		},
		csShowAddCardBtn: () => {
			const activeCard = DeckCtrl.logData().activeCard
			if (activeCard === 0) {
				document.querySelector(UISelectors.csAddCardBtn).classList.add('show');
				document.querySelector(UISelectors.csEditCardBtn).classList.remove('show');
			}
		},
		csResetPrevLastCardText: () => {
			const activeCard = DeckCtrl.logData().activeCard;
			const activeDeck = DeckCtrl.logData().activeDeck;
			const lastCard = document.querySelector(UISelectors.csCardSlider).children[activeCard];
			const lastCardQuestion = lastCard.firstElementChild.children[0].firstElementChild;
			const lastCardAnswer = lastCard.firstElementChild.children[1].firstElementChild;
			lastCardQuestion.textContent = '';
			lastCardAnswer.textContent = '';
			if (activeCard - 1 > 0) {
				lastCardQuestion.textContent = activeDeck.cards[activeCard - 2].question;
				lastCardAnswer.textContent = activeDeck.cards[activeCard - 2].answer;
			}
		},
		csResetNextLastCardText: () => {
			const activeCard = DeckCtrl.logData().activeCard;
			const activeDeck = DeckCtrl.logData().activeDeck;
			const lastCard = document.querySelector(UISelectors.csCardSlider).children[activeCard + 2];
			const lastCardQuestion = lastCard.firstElementChild.children[0].firstElementChild;
			const lastCardAnswer = lastCard.firstElementChild.children[1].firstElementChild;
			lastCardQuestion.textContent = activeDeck.cards[activeCard].question;
			lastCardAnswer.textContent = activeDeck.cards[activeCard].answer;
		},
		csResetPreviewCardText: () => {
			const prevCard = document.querySelector(UISelectors.csCardSlider).children[1];
			const prevCardQuestion = prevCard.firstElementChild.children[0].firstElementChild;
			const prevCardAnswer = prevCard.firstElementChild.children[1].firstElementChild;
			prevCardQuestion.textContent = '';
			prevCardAnswer.textContent = '';
		},
		csSetCardIndexInpText: () => {
			const cardSliderIndexInpEl = document.querySelector(UISelectors.csCardSliderIndexInp);
			const activeDeck = DeckCtrl.logData().activeDeck;
			const activeCard = DeckCtrl.logData().activeCard;
			cardSliderIndexInpEl.value = activeDeck.cards.length - activeCard + 1;
		},
		csSetDeckLengthLabText: () => {
			const activeDeckLength = DeckCtrl.logData().activeDeck.cards.length;
			const csDeckLengthIndexLabEl = document.querySelector(UISelectors.csCardSliderIndexLab);
			csDeckLengthIndexLabEl.textContent = activeDeckLength;
		},
		csDeleteCardFromSlider: (e) => {
			const card = e.target.parentElement.parentElement.parentElement;
			card.remove();
		},
		csClearDeckUI: () => {
			const sliderEl = document.querySelector(UISelectors.csCardSlider);
			Array.from(sliderEl.children).forEach(card => card.remove());
		},
		csSetupDeckSliderUI: () => {
			const sliderEl = document.querySelector(UISelectors.csCardSlider);
			for (let i = 2; i > 0; i--) {
				const card = document.createElement('DIV');
				card.className = `card ${i === 2 ? 'prev' : 'active'}`;
				card.innerHTML = `
					<div class="card__inner">
						<div class="card__inner--front">
							<p class="card-text card-question-text"></p>
							<button class="delete-card-btn">x</button>
						</div>
						<div class="card__inner--back">
							<p class="card-text card-answer-text"></p>
							<button class="delete-card-btn">x</button>
						</div>
					</div>
				`;
				sliderEl.appendChild(card);
			};
			const nav = document.createElement('DIV');
			nav.className ='card-nav';
			nav.innerHTML = `
				<div id="cs-card-nav__right" class="card-nav__right">)</div>
				<div id="cs-card-nav__left" class="card-nav__left">(</div>
				<div class="card-nav__index">
					<input type="number" id="cs-card-nav__index-input" class="card-nav__index-input" value="1">
					<label for="card-nav__index-input" id="cs-card-nav__index-label" class="card-nav__index-label">0</label>
				</div>
			`;
			sliderEl.appendChild(nav);
		},
		csNavDeckByIndexInp: (activeCard) => {
			activeCard = Number(activeCard);
			const cardsEls = Array.from(document.querySelector(UISelectors.csCardSlider).children);
			cardsEls.forEach((child, index) => {
				if (child.classList.contains('prev')
						|| child.classList.contains('active')
						|| child.classList.contains('first')
						|| child.classList.contains('second')) {
					child.className = 'card';
				};
				if (child.classList.contains('card-nav')) return;
				index === 3 + activeCard && (child.className = 'card second');
				index === 2 + activeCard && (child.className = 'card first');
				index === 1 + activeCard && (child.className = 'card active');
				index === 0 + activeCard && (child.className = 'card prev');
			});
		},
		csSelectQuestionInp: () => {
			document.querySelector(UISelectors.csCardQuestionInp).select();
		},
		csSelectAnswerInp: () => {
			document.querySelector(UISelectors.csCardAnswerInp).select();
		},

		// Edit section methods
		esPrintTitle: (deckName) => {
			const titleEL = document.querySelector(UISelectors.esDeckNameSectionTitle);
			titleEL.textContent = deckName;
		},
		esPrintDeckName: (deckName) => {
			const deckNameInp = document.querySelector(UISelectors.esEditDeckNameInp);
			deckNameInp.value = deckName;
		},
		esClearDeckUI: () => {
			const sliderEl = document.querySelector(UISelectors.esCardSlider);
			Array.from(sliderEl.children).forEach(card => card.remove());
		},
		esSetupDeckSliderUI: () => {
			const sliderEl = document.querySelector(UISelectors.esCardSlider);
			for (let i = 2; i > 0; i--) {
				const card = document.createElement('DIV');
				card.className = `card ${i === 2 ? 'prev' : 'active'}`;
				card.innerHTML = `
					<div class="card__inner">
						<div class="card__inner--front">
							<p class="card-text card-question-text"></p>
							<button class="delete-card-btn">x</button>
						</div>
						<div class="card__inner--back">
							<p class="card-text card-answer-text"></p>
							<button class="delete-card-btn">x</button>
						</div>
					</div>
				`;
				sliderEl.appendChild(card);
			};
			const nav = document.createElement('DIV');
			nav.className ='card-nav';
			nav.innerHTML = `
				<div id="es-card-nav__right" class="card-nav__right">)</div>
				<div id="es-card-nav__left" class="card-nav__left">(</div>
				<div class="card-nav__index">
					<input type="number" id="es-card-nav__index-input" class="card-nav__index-input" value="1">
					<label for="card-nav__index-input" id="es-card-nav__index-label" class="card-nav__index-label">0</label>
				</div>
			`;
			sliderEl.appendChild(nav);
		},
		esPopulateCardSlider: () => {
			const cardsSlider = document.querySelector(UISelectors.esCardSlider);
			const activeDeck = DeckCtrl.logData().activeDeck;
			const cardsToPrint = activeDeck.cards.length;
			for (i = 0; i < cardsToPrint; i++) {
				const div = document.createElement('DIV');
				div.className = 'card';
				div.innerHTML = `
					<div class="card__inner">
						<div class="card__inner--front">
							<p class="card-question-text">${activeDeck.cards[i].question}</p>
							<button class="delete-card-btn">x</button>
						</div>
						<div class="card__inner--back">
							<p class="card-answer-text">${activeDeck.cards[i].answer}</p>
							<button class="delete-card-btn">x</button>
						</div>
					</div>
				`;
				cardsSlider.insertBefore(div, cardsSlider.lastElementChild);
			}
		},
		esCreateCardUI: (card) => {
			const cardsSlider = document.querySelector(UISelectors.esCardSlider);
			const div = document.createElement('DIV');
			div.className = 'card';
			div.innerHTML = `
				<div class="card__inner">
					<div class="card__inner--front">
						<p class="card-question-text">${card.question}</p>
						<button class="delete-card-btn">x</button>
					</div>
					<div class="card__inner--back">
					<p class="card-answer-text">${card.answer}</p>
						<button class="delete-card-btn">x</button>
					</div>
				</div>
			`;
			cardsSlider.prepend(div);
		},
		esSortCardsUI: (deck) => {
			const deckLength = deck.cards.length;
			const cards = document.querySelector(UISelectors.esCardSlider).children;
			deckLength > 0 && (cards[0].className = 'card prev');
			deckLength > 0 && (cards[1].className = 'card active');
			deckLength > 0 && (cards[2].className = 'card first');
			deckLength > 1 && (cards[3].className = 'card second');
			deckLength > 2 && (cards[4].className = 'card third-and-up');
		},
		esShowDeckNav: () => {
			const cardNavBtnRight = document.querySelector(UISelectors.esCardNavBtnRight);
			const cardNavBtnLeft = document.querySelector(UISelectors.esCardNavBtnLeft);
			const cards = DeckCtrl.logData().activeDeck.cards;
			const activeCard = DeckCtrl.logData().activeCard;
			cards.length > activeCard
				? cardNavBtnRight.classList.add('show')
				: cardNavBtnRight.classList.remove('show');
			activeCard > 0
				? cardNavBtnLeft.classList.add('show')
				: cardNavBtnLeft.classList.remove('show');
		},
		esShowNextCard: () => {
			const cardsEls = Array.from(document.querySelector(UISelectors.esCardSlider).children);
			const activeCard = DeckCtrl.logData().activeCard;
			cardsEls.forEach((child, index) => {
				if (child.classList.contains('card-nav')) return;
				index === 3 + activeCard && (child.className = 'card second');
				index === 2 + activeCard && (child.className = 'card first');
				index === 1 + activeCard && (child.className = 'card active');
				index === 0 + activeCard && (child.className = 'card prev');
			});
		},
		esShowPrevCard: () => {
			let cardsEls = Array.from(document.querySelector(UISelectors.esCardSlider).children);
			let activeCard = DeckCtrl.logData().activeCard;
			cardsEls.forEach((child, index) => {
				if (child.classList.contains('card-nav')) return;
				index === 4 + activeCard && (child.className = 'card third-and-up');
				index === 3 + activeCard && (child.className = 'card second');
				index === 2 + activeCard && (child.className = 'card first');
				index === 1 + activeCard && (child.className = 'card active');
				index === 0 + activeCard && (child.className = 'card prev');	
			});
		},
		esResetPrevLastCardText: () => {
			const activeCard = DeckCtrl.logData().activeCard;
			const activeDeck = DeckCtrl.logData().activeDeck;
			const lastCard = document.querySelector(UISelectors.esCardSlider).children[activeCard];
			const lastCardQuestion = lastCard.firstElementChild.children[0].firstElementChild;
			const lastCardAnswer = lastCard.firstElementChild.children[1].firstElementChild;
			lastCardQuestion.textContent = '';
			lastCardAnswer.textContent = '';
			if (activeCard - 1 > 0) {
				lastCardQuestion.textContent = activeDeck.cards[activeCard - 2].question;
				lastCardAnswer.textContent = activeDeck.cards[activeCard - 2].answer;
			}
		},
		esResetNextLastCardText: () => {
			const activeCard = DeckCtrl.logData().activeCard;
			const activeDeck = DeckCtrl.logData().activeDeck;
			const lastCard = document.querySelector(UISelectors.esCardSlider).children[activeCard + 2];
			const lastCardQuestion = lastCard.firstElementChild.children[0].firstElementChild;
			const lastCardAnswer = lastCard.firstElementChild.children[1].firstElementChild;
			lastCardQuestion.textContent = activeDeck.cards[activeCard].question;
			lastCardAnswer.textContent = activeDeck.cards[activeCard].answer;
		},
		esShowEditCardBtn: () => {
			const activeCard = DeckCtrl.logData().activeCard
			if (activeCard > 0) {
				document.querySelector(UISelectors.esAddCardBtn).classList.remove('show');
				document.querySelector(UISelectors.esEditCardBtn).classList.add('show');
			}
		},
		esShowAddCardBtn: () => {
			const activeCard = DeckCtrl.logData().activeCard
			if (activeCard === 0) {
				document.querySelector(UISelectors.esAddCardBtn).classList.add('show');
				document.querySelector(UISelectors.esEditCardBtn).classList.remove('show');
			}
		},
		esDisplayCardInInputFields: () => {
			const activeDeck = DeckCtrl.logData().activeDeck;
			const activeCard = DeckCtrl.logData().activeCard;
			const questionInputEl = document.querySelector(UISelectors.esCardQuestionInp);
			const answerInputEl = document.querySelector(UISelectors.esCardAnswerInp);
			if (activeCard > 0) {
				const question = activeDeck.cards[activeCard - 1].question;
				const answer = activeDeck.cards[activeCard - 1].answer;
				questionInputEl.value = question;
				answerInputEl.value = answer;
			} else if (activeCard === 0) {
				questionInputEl.value = '';
				answerInputEl.value = '';
				questionInputEl.focus();
			};
		},
		esSetCardIndexInpText: () => {
			const cardSliderIndexInpEl = document.querySelector(UISelectors.esCardSliderIndexInp);
			const activeDeck = DeckCtrl.logData().activeDeck;
			const activeCard = DeckCtrl.logData().activeCard;
			cardSliderIndexInpEl.value = activeDeck.cards.length - activeCard + 1;
		},
		esSetDeckLengthLabText: () => {
			const activeDeckLength = DeckCtrl.logData().activeDeck.cards.length;
			const csDeckLengthIndexLabEl = document.querySelector(UISelectors.esCardSliderIndexLab);
			csDeckLengthIndexLabEl.textContent = activeDeckLength;
		},
		esFocusQuestionInpEl: () => {
			document.querySelector(UISelectors.esCardQuestionInp).focus();
		},
		esClearActiveCardFront: () => {
			document.querySelector(UISelectors.esCardActiveFront).textContent = '';
		},
		esClearActiveCardBack: () => {
			document.querySelector(UISelectors.esCardActiveBack).textContent = '';
		},
		esPrintQuestion: (e) => {
			const MAX_Q_LENGTH = 80;
			let questionInput = document.querySelector(UISelectors.esCardQuestionInp).value;
			let questionOutput = document.querySelector(UISelectors.esCardActiveFront);
			questionInput.length > MAX_Q_LENGTH
				? questionOutput.textContent = questionInput.substring(0, MAX_Q_LENGTH) + '...'
				: questionOutput.textContent = questionInput;
		},
		esPrintAnswer: (e) => {
			const MAX_A_LENGTH = 80;
			let answerInput = document.querySelector(UISelectors.esCardAnswerInp).value;
			let answerOutput = document.querySelector(UISelectors.esCardActiveBack);
			answerInput.length > MAX_A_LENGTH
				? answerOutput.textContent = answerInput.substring(0, MAX_A_LENGTH) + '...'
				: answerOutput.textContent = answerInput;
		},
		esSelectQuestionInp: () => {
			document.querySelector(UISelectors.esCardQuestionInp).select();
		},
		esSelectAnswerInp: () => {
			document.querySelector(UISelectors.esCardAnswerInp).select();
		},
		esUpdateSectionTitle: (deckName) => {
			const titleEl = document.querySelector(UISelectors.esDeckNameSectionTitle);
			titleEl.textContent = deckName;
		},
		esDeleteCardFromSlider: (e) => {
			const card = e.target.parentElement.parentElement.parentElement;
			card.remove();
		},
		esNavDeckByIndexInp: (activeCard) => {
			activeCard = Number(activeCard);
			const cardsEls = Array.from(document.querySelector(UISelectors.esCardSlider).children);
			cardsEls.forEach((child, index) => {
				if (child.classList.contains('prev')
						|| child.classList.contains('active')
						|| child.classList.contains('first')
						|| child.classList.contains('second')) {
					child.className = 'card';
				};
				if (child.classList.contains('card-nav')) return;
				index === 3 + activeCard && (child.className = 'card second');
				index === 2 + activeCard && (child.className = 'card first');
				index === 1 + activeCard && (child.className = 'card active');
				index === 0 + activeCard && (child.className = 'card prev');
			});
		},
		esResetPreviewCardText: () => {
			const prevCard = document.querySelector(UISelectors.esCardSlider).children[1];
			const prevCardQuestion = prevCard.firstElementChild.children[0].firstElementChild;
			const prevCardAnswer = prevCard.firstElementChild.children[1].firstElementChild;
			prevCardQuestion.textContent = '';
			prevCardAnswer.textContent = '';
		},

		// Practice section methods
		psPrintTitle: (deckName) => {
			const titleEL = document.querySelector(UISelectors.psDeckNameSectionTitle);
			titleEL.textContent = deckName;
		},
		psSetCounterCurrent: () => {
			const activeCard = DeckCtrl.logData().activeCard;
			const counterCurrent = document.querySelector(UISelectors.psProgressCounterCurrent);
			counterCurrent.textContent = activeCard + 1;
		},
		psSetCounterTotal: () => {
			const activeDeck = DeckCtrl.logData().activeDeck;
			const counterTotal = document.querySelector(UISelectors.psProgressCounterTotal);
			counterTotal.textContent = activeDeck.cards.length;
		},
		psSetProgressBar: () => {
			const progressBar = document.querySelector(UISelectors.psProgressBar);
			const totalCards = DeckCtrl.logData().activeDeck ? DeckCtrl.logData().activeDeck.cards.length : 0;
			const currentCard = DeckCtrl.logData().activeCard;
			progressBar.style.width = currentCard / (totalCards - 1) * 100 + '%';
		},
		psPopulateCardSlider: () => {
			const cardsSlider = document.querySelector(UISelectors.psCardSlider);
			const activeDeck = DeckCtrl.logData().activeDeck;
			const cardsToPrint = activeDeck.cards.length;
			for (i = 0; i < cardsToPrint; i++) {
				const div = document.createElement('DIV');
				div.className = 'card';
				div.innerHTML = `
					<div class="card__inner">
						<div class="card__inner--front">
							<p class="card-question-text">${activeDeck.cards[i].question}</p>
						</div>
						<div class="card__inner--back">
							<p class="card-answer-text">${activeDeck.cards[i].answer}</p>
						</div>
					</div>
				`;
				cardsSlider.prepend(div);
			}
		},
		psSortCardsUI: (deck) => {
			const deckLength = deck.cards.length;
			const cards = document.querySelector(UISelectors.psCardSlider).children;
			deckLength > 0 && (cards[0].className = 'card card--active');
			deckLength > 0 && (cards[1].className = 'card card--next');
		},
		psShowNextCard: () => {
			const cardsEls = Array.from(document.querySelector(UISelectors.psCardSlider).children);
			const activeCard = DeckCtrl.logData().activeCard;
			cardsEls.forEach((child, index) => {
				index <=0 + activeCard && (child.className = 'card');
				index === 0 + activeCard && (child.className = 'card card--prev');
				index === 1 + activeCard && (child.className = 'card card--active');
				index === 2 + activeCard && (child.className = 'card card--next');
			});
		},
		psShowCardEvaluation: () => {
			const cardEvalContainer = document.querySelector(UISelectors.psEvalCardContainer);
			cardEvalContainer.style.display = 'flex';
		},
		psHideCardEvaluation: () => {
			const cardEvalContainer = document.querySelector(UISelectors.psEvalCardContainer);
			cardEvalContainer.style.display = 'none';
		},
		psShowFinishPracticeBtn: () => {
			const finishPracticeBtn = document.querySelector(UISelectors.psFinishPracticeContainer);
			finishPracticeBtn.style.display = 'block';
		},
		psHideFinishPracticeBtn: () => {
			const finishPracticeBtn = document.querySelector(UISelectors.psFinishPracticeContainer);
			finishPracticeBtn.style.display = 'none';
		},
		psClearDeckUI: () => {
			const sliderEl = document.querySelector(UISelectors.psCardSlider);
			Array.from(sliderEl.children).forEach(card => card.remove());
		},
		psCreateCardUI: () => {
			const cardsSlider = document.querySelector(UISelectors.psCardSlider);
			const div = document.createElement('DIV');
			div.className = 'card';
			div.innerHTML = `
				<div class="card__inner">
					<div class="card__inner--front">
						<p class="card-question-text">${newCard.question}</p>
					</div>
					<div class="card__inner--back">
					<p class="card-answer-text">${newCard.answer}</p>
					</div>
				</div>
			`;
			cardsSlider.append(div);
		},
		psInsertCardUI: (addIndex) => {
			const cardsSlider = document.querySelector(UISelectors.psCardSlider);
			const cardsUI = Array.from(cardsSlider.children);
			cardsUI.forEach((card, index) => {
				if (addIndex === index) {
					const newNode = cardsUI[cardsUI.length - 1];
					cardsSlider.insertBefore(newNode, card);
				} 
			});
		},

	}
})();

// APP CONTROLLER
const AppCtrl = (function (StorageCtrl, DeckCtrl, UICtrl) {
	// EVENT LISTENERS	
	const loadEventListeners = () => {
		const DOM = UICtrl.getSelectors();
		// General
		document
			.querySelectorAll(DOM.exitSectionBtn)
			.forEach((btn) => btn.addEventListener("click", exitSectionSubmit));

		// Main Section
		document
			.querySelector(DOM.msPracticeSectionBtn)
			.addEventListener("click", msPracticeSectionSubmit);
		document
			.querySelector(DOM.msPracticeSectionMenu)
			.addEventListener('keypress', msPracticeSectionMenuKeyEnter);
		document
			.querySelector(DOM.msCreateSectionBtn)
			.addEventListener("click", msCreateSectionSubmit);
		document
			.querySelector(DOM.msCreateSectionInp)
			.addEventListener('keypress', msCreateSectionMenuKeyEnter);
		document
			.querySelector(DOM.msEditSectionBtn)
			.addEventListener("click", msEditSectionSubmit);
		document
			.querySelector(DOM.msEditSectionMenu)
			.addEventListener('keypress', msEditSectionMenuKeyEnter);
		document
			.querySelector(DOM.msDeleteDeckBtn)
			.addEventListener('click', msDeleteDeckSubmit);
		document
			.querySelector(DOM.msDeleteDeckMenu)
			.addEventListener('keypress', msDeleteDeckMenuKeyEnter);
		// document
		// 	.querySelector(DOM.msStatisticsSectionBtn)
		// 	.addEventListener('click', msStatisticsSectionSubmit);
		// document
		// 	.querySelector(DOM.msStatisticsSectionMenu)
		// 	.addEventListener("keypress", msStatisticsSectionMenuKeyEnter);
		document
			.querySelector(DOM.msEditSectionMenu)
			.addEventListener('click', selectDeckToEdit);
		document
			.querySelectorAll(DOM.msInputFields)
			.forEach(field => field
			.addEventListener('focus', msResetInputFields));

		// Create Section
		document
			.querySelector(DOM.csCreateDeckNameInp)
			.addEventListener('input', csCreateDeckNameInp);
		document
			.querySelector(DOM.csCardQuestionInp)
			.addEventListener('input', csCardQuestionInp);
		document
			.querySelector(DOM.csCardAnswerInp)
			.addEventListener('input', csCardAnswerInp);
		document
			.querySelector(DOM.csAddCardBtn)
			.addEventListener('click', csAddCardSubmit);
		document
			.querySelector(DOM.csCardQuestionInp)
			.addEventListener('focus', csCardQuestionInpFocus);
		document
			.querySelector(DOM.csCardAnswerInp)
			.addEventListener('focus', csCardAnswerInpFocus);
		document
			.querySelector(DOM.csEditCardBtn)
			.addEventListener('click', csEditCardSubmit);
		document
			.querySelector(DOM.csCardSlider)
			.addEventListener('click', csCardClick);
		document
			.querySelector(DOM.csCardSlider)
			.addEventListener('click', csDeleteCardBtn);
		document
			.querySelector(DOM.csCardSlider)
			.addEventListener('click', csDeckNavBtn);
		document
			.querySelector(DOM.csCardSlider)
			.addEventListener('input', csCardSliderIndexInpNav);
		document
			.querySelector(DOM.csStoreDeckBtn)
			.addEventListener('click', csStoreDeckSubmit);
			
			// Edit Section
		document
			.querySelector(DOM.esCreateDeckNameInp)
			.addEventListener('input', esEditDeckNameInp);
		document
			.querySelector(DOM.esCardQuestionInp)
			.addEventListener('input', esCardQuestionInp);
		document
			.querySelector(DOM.esCardAnswerInp)
			.addEventListener('input', esCardAnswerInp);
		document
			.querySelector(DOM.esAddCardBtn)
			.addEventListener('click', esAddCardSubmit);
		document
			.querySelector(DOM.esCardQuestionInp)
			.addEventListener('focus', esCardQuestionInpFocus);
		document
			.querySelector(DOM.esCardAnswerInp)
			.addEventListener('focus', esCardAnswerInpFocus);
		document
			.querySelector(DOM.esEditCardBtn)
			.addEventListener('click', esEditCardSubmit);
		document
			.querySelector(DOM.esCardSlider)
			.addEventListener('click', esCardClick);
		document
			.querySelector(DOM.esCardSlider)
			.addEventListener('click', esDeleteCardBtn);
		document
			.querySelector(DOM.esCardSlider)
			.addEventListener('click', esDeckNavBtn);
		document
			.querySelector(DOM.esCardSlider)
			.addEventListener('input', esCardSliderIndexInpNav);
		document
			.querySelector(DOM.esSaveChangesBtn)
			.addEventListener('click', esSaveChangesSubmit);
			
			// Practice Section
		document
			.querySelector(DOM.msPracticeSectionMenu)
			.addEventListener('click', selectDeckToPractice);
		document
			.querySelector(DOM.psEvalCardEasyBtn)
			.addEventListener('click', psEvalCardEasySubmit);
		document
			.querySelector(DOM.psEvalCardOkBtn)
			.addEventListener('click', psEvalCardOkSubmit);
		document
			.querySelector(DOM.psEvalCardHardBtn)
			.addEventListener('click', psEvalCardHardSubmit);
		document
			.querySelector(DOM.psCardSlider)
			.addEventListener('click', psCardClick);
		document
			.querySelector(DOM.psFinishPracticeBtn)
			.addEventListener('click', psFinishPracticeSubmit)

	};


	
	// FUNCTIONS

	// General
	const exitSectionSubmit = (e) => {
		const DOM = UICtrl.getSelectors();
		const cubeSide = e.target.parentElement.parentElement.parentElement;
		UICtrl.navigateMainSection();
		DeckCtrl.clearData();
		if (cubeSide.classList.contains('cube__side--create')) {
			UICtrl.clearInpVal(document.querySelector(DOM.csCardQuestionInp));
			UICtrl.clearInpVal(document.querySelector(DOM.csCardAnswerInp));
		}
		if (cubeSide.classList.contains('cube__side--edit')) {
			UICtrl.clearInpVal(document.querySelector(DOM.esCardQuestionInp));
			UICtrl.clearInpVal(document.querySelector(DOM.esCardAnswerInp));
		}
		if (cubeSide.classList.contains('cube__side--practice')) {
			UICtrl.psSetProgressBar();
		}
	};
	const populateMenusWithLS = () => {
		const DOM = UICtrl.getSelectors();
		JSON.parse(localStorage.getItem('decks')) &&
		JSON.parse(localStorage.getItem('decks')).forEach(deck => {
			UICtrl.addDeckToSelectMenu(DOM.msPracticeSectionMenu);
			UICtrl.addDeckToSelectMenu(DOM.msEditSectionMenu);
			UICtrl.addDeckToSelectMenu(DOM.msDeleteDeckMenu);
			UICtrl.addDeckToSelectMenu(DOM.msStatisticsSectionMenu);
		});
	};

	// Main Section
	const msPracticeSectionSubmit = (e) => {
		e.preventDefault();
		const deckNameInputEl = e.target.parentElement.firstElementChild;
		const activeDeck = DeckCtrl.logData().activeDeck;
		if (!deckNameInputEl.value) return
		UICtrl.psClearDeckUI();
		UICtrl.psHideFinishPracticeBtn();
		UICtrl.psShowCardEvaluation();
		UICtrl.navigatePracticeSection(e);
		UICtrl.psPrintTitle(deckNameInputEl.value);
		UICtrl.psSetCounterCurrent();
		UICtrl.psSetCounterTotal();
		UICtrl.psSetProgressBar();
		UICtrl.psPopulateCardSlider();
		UICtrl.psSortCardsUI(activeDeck);
		UICtrl.clearInpVal(deckNameInputEl);
	};
	
	const msPracticeSectionMenuKeyEnter = (e) => {
		const deckNameInputEl = e.target;
		if (!deckNameInputEl.value || e.key !== 'Enter') return;
		UICtrl.navigatePracticeSection(e);
	};

	const msCreateSectionSubmit = (e) => {
		e.preventDefault();
		const deckNameInputEl = e.target.parentElement.firstElementChild
		if (!deckNameInputEl.value) {
			e.target.parentElement.firstElementChild.focus();
			return;
		};
		UICtrl.csClearDeckUI();
		UICtrl.csSetupDeckSliderUI();
		UICtrl.navigateCreateSection(e);
		DeckCtrl.addDeck(deckNameInputEl.value);
		UICtrl.csPrintTitle(deckNameInputEl.value);
		UICtrl.csPrintDeckName(deckNameInputEl.value);
		UICtrl.clearInpVal(deckNameInputEl);
	};
	
	const msCreateSectionMenuKeyEnter = (e) => {
		const deckNameInputEl = e.target;
		if (!deckNameInputEl.value || e.key !== 'Enter') return;
		UICtrl.csClearDeckUI();
		UICtrl.csSetupDeckSliderUI();
		UICtrl.navigateCreateSection(e);
		DeckCtrl.addDeck(deckNameInputEl.value);
		UICtrl.csPrintTitle(deckNameInputEl.value);
		UICtrl.csPrintDeckName(deckNameInputEl.value);
		UICtrl.clearInpVal(e.target);
	};

	const msEditSectionSubmit = (e) => {
		e.preventDefault();
		const deckNameInputEl = e.target.parentElement.firstElementChild;
		const activeDeck = DeckCtrl.logData().activeDeck;
		if (!deckNameInputEl.value) return;
		UICtrl.esClearDeckUI();
		UICtrl.esSetupDeckSliderUI();
		UICtrl.esPopulateCardSlider();
		UICtrl.esSortCardsUI(activeDeck);
		UICtrl.navigateEditSection(e);
		UICtrl.esPrintTitle(deckNameInputEl.value);
		UICtrl.esPrintDeckName(deckNameInputEl.value);
		UICtrl.clearInpVal(deckNameInputEl);
		UICtrl.esShowAddCardBtn();
		UICtrl.esShowDeckNav();
		UICtrl.esSetDeckLengthLabText();
		UICtrl.esSetCardIndexInpText(); // TODO: Evaluate position state
	};

	const msEditSectionMenuKeyEnter = (e) => {
		const deckNameInputEl = e.target.parentElement.firstElementChild;
		const activeDeck = DeckCtrl.logData().activeDeck;
		if (!deckNameInputEl.value || !e.key === 'Enter') return;
		UICtrl.esClearDeckUI();
		UICtrl.esSetupDeckSliderUI();
		UICtrl.esPopulateCardSlider();
		UICtrl.esSortCardsUI(activeDeck);
		UICtrl.navigateEditSection(e);
		UICtrl.esPrintTitle(deckNameInputEl.value);
		UICtrl.esPrintDeckName(deckNameInputEl.value);
		UICtrl.clearInpVal(deckNameInputEl);
		UICtrl.esShowDeckNav();
		UICtrl.esSetDeckLengthLabText();
		UICtrl.esSetCardIndexInpText(); // TODO: Evaluate position state	};
	}

	const msDeleteDeckSubmit = (e) => {
		e.preventDefault();
		const DOM = UICtrl.getSelectors();
		const deckNameInputEl = e.target.parentElement.firstElementChild;
		if (!deckNameInputEl) return;
		StorageCtrl.deleteDeck(deckNameInputEl.value);
		UICtrl.addDeckToSelectMenu(DOM.msPracticeSectionMenu);
		UICtrl.addDeckToSelectMenu(DOM.msEditSectionMenu);
		UICtrl.addDeckToSelectMenu(DOM.msDeleteDeckMenu);
		UICtrl.addDeckToSelectMenu(DOM.msStatisticsSectionMenu);
		UICtrl.clearInpVal(deckNameInputEl);
	}

	const msDeleteDeckMenuKeyEnter = (e) => {
		const DOM = UICtrl.getSelectors();
		const msDeleteSectionInp = e.target.parentElement.firstElementChild;
		if (!msDeleteSectionInp.value || !e.key === 'Enter') return;
		StorageCtrl.deleteDeck(msDeleteSectionInp.value);
		UICtrl.addDeckToSelectMenu(DOM.msPracticeSectionMenu);
		UICtrl.addDeckToSelectMenu(DOM.msEditSectionMenu);
		UICtrl.addDeckToSelectMenu(DOM.msDeleteDeckMenu);
		UICtrl.addDeckToSelectMenu(DOM.msStatisticsSectionMenu);
		UICtrl.clearInpVal(msDeleteSectionInp);
	};

	const msStatisticsSectionSubmit = (e) => {
		e.preventDefault();
		const deckNameInputEl = e.target.parentElement.firstElementChild;
		if (!deckNameInputEl.value) return;
	};

	const msStatisticsSectionMenuKeyEnter = (e) => {
		const deckNameInputEl = e.target;
		if (!deckNameInputEl.value || !e.key === 'Enter') return;
		UICtrl.navigateStatisticsSection(e);
	};

	const msResetInputFields = (e) => {
		const DOM = UICtrl.getSelectors();
		const inputFields = document.querySelectorAll(DOM.msInputFields);
		inputFields.forEach(field => UICtrl.clearInpVal(field));
	}

	// Create Section
	const csCreateDeckNameInp = () => {
		const UISelectors = UICtrl.getSelectors();
		const deckNameInp = document.querySelector(UISelectors.csCreateDeckNameInp).value;
		UICtrl.csUpdateSectionTitle(deckNameInp);
		DeckCtrl.logData().activeDeck.name = deckNameInp;
	};

	const csCardQuestionInp = () => {
		UICtrl.csPrintQuestion();
	};

	const csCardAnswerInp = () => {
		UICtrl.csPrintAnswer();
	};

	const csAddCardSubmit = (e) => {
		e.preventDefault();
		const UISelectors = UICtrl.getSelectors();
		const question = document.querySelector(UISelectors.csCardQuestionInp).value;
		const answer = document.querySelector(UISelectors.csCardAnswerInp).value;
		if (question === '' || answer === '') return;
		const activeDeck = DeckCtrl.logData().activeDeck;
		const activeInnerCardEl = Array.from(document.querySelector(UISelectors.csCardSlider).children)[1].firstElementChild;
		DeckCtrl.addCard(question, answer);
		UICtrl.csCreateCardUI();
		UICtrl.csSortCardsUI(activeDeck);
		UICtrl.flipCardFront(activeInnerCardEl);
		UICtrl.clearInpVal(document.querySelector(UISelectors.csCardQuestionInp));
		UICtrl.clearInpVal(document.querySelector(UISelectors.csCardAnswerInp));
		UICtrl.csClearActiveCardFront();
		UICtrl.csClearActiveCardBack();
		UICtrl.csFocusQuestionInpEl();
		UICtrl.csShowDeckNav();
		UICtrl.csSetCardIndexInpText();
		UICtrl.csSetDeckLengthLabText();
	};
	
	const csDeckNavBtn = (e) => {	
		if (!(e.target.classList.contains('card-nav__right') || e.target.classList.contains('card-nav__left'))) return;
		const UISelectors = UICtrl.getSelectors();
		const card = DeckCtrl.logData().activeCard;
		const activeInnerCardEl = Array.from(document.querySelector(UISelectors.csCardSlider).children)[card + 1].firstElementChild;
		if (e.target.classList.contains('card-nav__right')) {
			DeckCtrl.logData().activeCard++;
			UICtrl.flipCardFront(activeInnerCardEl);
			UICtrl.csShowNextCard();
			UICtrl.csResetPrevLastCardText();
		};
		if (e.target.classList.contains('card-nav__left')) {
			DeckCtrl.logData().activeCard--;
			UICtrl.flipCardFront(activeInnerCardEl);
			UICtrl.csShowPrevCard();
			UICtrl.csResetNextLastCardText();
		};
		const activeDeck = DeckCtrl.logData().activeDeck;
		const activeCard = DeckCtrl.logData().activeCard;
		let newCardID = activeCard > 0 ? activeDeck.cards[activeCard - 1].id : 0;
		DeckCtrl.logData().activeCardID = newCardID;
		UICtrl.csDisplayCardInInputFields();
		UICtrl.csShowAddCardBtn();
		UICtrl.csShowEditCardBtn();
		UICtrl.csShowDeckNav();
		UICtrl.csSetCardIndexInpText();
	};
	
	const csCardQuestionInpFocus = () => {
		const UISelectors = UICtrl.getSelectors();
		UICtrl.flipCardFront(document.querySelector(UISelectors.csCardActiveInner));
	};
	
	const csCardAnswerInpFocus = () => {
		const UISelectors = UICtrl.getSelectors();
		UICtrl.flipCardBack(document.querySelector(UISelectors.csCardActiveInner));
	};
	
	const csCardClick = (e) => {	
		const target = e.target;
		if (!target.parentElement.parentElement.classList.contains('active')) return;
		if (target.classList.contains('card__inner--front')) {
			UICtrl.flipCardBack(target.parentElement);
			UICtrl.csSelectAnswerInp();
		} else if (target.classList.contains('card__inner--back')) {
			UICtrl.flipCardFront(target.parentElement);
			UICtrl.csSelectQuestionInp();
		};
	};
	
	const csEditCardSubmit = (e) => {
		e.preventDefault();
		const DOM = UICtrl.getSelectors();
		const newQuestion = document.querySelector(DOM.csCardQuestionInp).value;
		const newAnswer = document.querySelector(DOM.csCardAnswerInp).value; 
		const cardIndex = DeckCtrl.logData().activeCard - 1;
		const currentCardData = DeckCtrl.logData().activeDeck.cards[cardIndex];
		currentCardData.question = newQuestion;
		currentCardData.answer = newAnswer;
	};

	const csDeleteCardBtn = (e) => {
		e.preventDefault();
		const card = e.target.parentElement.parentElement.parentElement;
		if (!e.target.classList.contains('delete-card-btn')) return;
		if (!card.classList.contains('active')) return;
		const activeCard = DeckCtrl.logData().activeCard;
		const activeDeck = DeckCtrl.logData().activeDeck;
		const cardID = DeckCtrl.logData().activeCardID
		DeckCtrl.deleteCard(activeDeck, cardID);
		UICtrl.csDeleteCardFromSlider(e);
		let newCardID
		if (activeCard > activeDeck.cards.length) {
			DeckCtrl.logData().activeCard--;
			UICtrl.csShowPrevCard();
			newCardID = activeCard > 2 ? newCardID = activeDeck.cards[activeCard - 2].id : 0;
		} else {
			UICtrl.csShowNextCard();
			newCardID = activeCard > 0 ? newCardID = activeDeck.cards[activeCard - 1].id : 0;
		};
		UICtrl.csShowDeckNav();
		UICtrl.csSetCardIndexInpText();
		UICtrl.csSetDeckLengthLabText();
		UICtrl.csDisplayCardInInputFields();
		DeckCtrl.logData().activeCardID = newCardID;
	};

	const csStoreDeckSubmit = () => {
		const DOM = UICtrl.getSelectors();
		const activeDeck = DeckCtrl.logData().activeDeck;
		if (!activeDeck.cards.length > 0) return;
		StorageCtrl.storeDeck(activeDeck);
		UICtrl.navigateMainSection();
		DeckCtrl.clearData();
		UICtrl.clearInpVal(document.querySelector(DOM.csCardQuestionInp));
		UICtrl.clearInpVal(document.querySelector(DOM.csCardAnswerInp));
		UICtrl.addDeckToSelectMenu(DOM.msPracticeSectionMenu);
		UICtrl.addDeckToSelectMenu(DOM.msEditSectionMenu);
		UICtrl.addDeckToSelectMenu(DOM.msDeleteDeckMenu);
		UICtrl.addDeckToSelectMenu(DOM.msStatisticsSectionMenu);
	};

	const csCardSliderIndexInpNav = (e) => {		
		const target = e.target;
		if (!target.classList.contains('card-nav__index-input')) return;
		let cardIndexVal = target.value;
		const activeDeck = DeckCtrl.logData().activeDeck;
		const deckLength = activeDeck.cards.length;
		target.value  
			= cardIndexVal > deckLength + 1
			? deckLength + 1
			: cardIndexVal === '0'
			? 1
			: cardIndexVal;
		cardIndexVal = target.value;
		const activeCard = (deckLength + 1) - cardIndexVal;
		DeckCtrl.logData().activeCard = activeCard;
		// TODO: Fix ghost card
		DeckCtrl.logData().activeCardID 
			= cardIndexVal <= deckLength 
			? activeDeck.cards[activeCard - 1].id
			: 0;
		UICtrl.csNavDeckByIndexInp(activeCard);
		UICtrl.csShowDeckNav();
		UICtrl.csShowAddCardBtn();
		UICtrl.csShowEditCardBtn();
		UICtrl.csDisplayCardInInputFields();
		UICtrl.csResetPreviewCardText();
	};

	// Edit Section
	const selectDeckToEdit = (e) => {
		const storedDecks = JSON.parse(localStorage.getItem('decks'));
		const selectedDeck = storedDecks.filter(deck => deck.name === e.target.value)[0];
		DeckCtrl.logData().activeDeck = selectedDeck;
	};

	const esDeckNavBtn = (e) => {	
		if (!(e.target.classList.contains('card-nav__right') || e.target.classList.contains('card-nav__left'))) return;
		const UISelectors = UICtrl.getSelectors();
		const card = DeckCtrl.logData().activeCard;
		const activeInnerCardEl = Array.from(document.querySelector(UISelectors.esCardSlider).children)[card + 1].firstElementChild;
		if (e.target.classList.contains('card-nav__right')) {
			DeckCtrl.logData().activeCard++;
			UICtrl.flipCardFront(activeInnerCardEl);
			UICtrl.esShowNextCard();
			UICtrl.esResetPrevLastCardText();
		};
		if (e.target.classList.contains('card-nav__left')) {
			DeckCtrl.logData().activeCard--;
			UICtrl.flipCardFront(activeInnerCardEl);
			UICtrl.esShowPrevCard();
			UICtrl.esResetNextLastCardText();
		};
		const activeDeck = DeckCtrl.logData().activeDeck;
		const activeCard = DeckCtrl.logData().activeCard;
		let newCardID = activeCard > 0 ? activeDeck.cards[activeCard - 1].id : 0;
		DeckCtrl.logData().activeCardID = newCardID;
		UICtrl.esDisplayCardInInputFields();
		UICtrl.esShowAddCardBtn();
		UICtrl.esShowEditCardBtn();
		UICtrl.esShowDeckNav();
		UICtrl.esSetCardIndexInpText();
	};
	const esCardClick = (e) => {	
		const target = e.target;
		if (!target.parentElement.parentElement.classList.contains('active')) return;
		if (target.classList.contains('card__inner--front')) {
			UICtrl.flipCardBack(target.parentElement);
			UICtrl.esSelectAnswerInp();
		} else if (target.classList.contains('card__inner--back')) {
			UICtrl.flipCardFront(target.parentElement);
			UICtrl.esSelectQuestionInp();
		};
	};
	const esAddCardSubmit = (e) => {
		e.preventDefault();
		const UISelectors = UICtrl.getSelectors();
		const question = document.querySelector(UISelectors.esCardQuestionInp).value;
		const answer = document.querySelector(UISelectors.esCardAnswerInp).value;
		if (question === '' || answer === '') return;
		const activeDeck = DeckCtrl.logData().activeDeck;
		const activeInnerCardEl = Array.from(document.querySelector(UISelectors.esCardSlider).children)[1].firstElementChild;
		DeckCtrl.addCard(question, answer);
		UICtrl.esCreateCardUI(newCard);
		UICtrl.esSortCardsUI(activeDeck);
		UICtrl.flipCardFront(activeInnerCardEl);
		UICtrl.clearInpVal(document.querySelector(UISelectors.esCardQuestionInp));
		UICtrl.clearInpVal(document.querySelector(UISelectors.esCardAnswerInp));
		UICtrl.esClearActiveCardFront();
		UICtrl.esClearActiveCardBack();
		UICtrl.esFocusQuestionInpEl();
		UICtrl.esShowDeckNav();
		UICtrl.esSetCardIndexInpText();
		UICtrl.esSetDeckLengthLabText();
	};

	const esCardQuestionInp = () => {
		UICtrl.esPrintQuestion();
	};

	const esCardAnswerInp = () => {
		UICtrl.esPrintAnswer();
	};

	const esCardQuestionInpFocus = () => {
		const UISelectors = UICtrl.getSelectors();
		UICtrl.flipCardFront(document.querySelector(UISelectors.esCardActiveInner));
	};
	
	const esCardAnswerInpFocus = () => {
		const UISelectors = UICtrl.getSelectors();
		UICtrl.flipCardBack(document.querySelector(UISelectors.esCardActiveInner));
	};

	const esEditDeckNameInp = () => {
		const UISelectors = UICtrl.getSelectors();
		const deckNameInp = document.querySelector(UISelectors.esCreateDeckNameInp).value;
		UICtrl.esUpdateSectionTitle(deckNameInp);
		DeckCtrl.logData().activeDeck.name = deckNameInp;
	};

	const esEditCardSubmit = (e) => {
		e.preventDefault();
		const DOM = UICtrl.getSelectors();
		const newQuestion = document.querySelector(DOM.esCardQuestionInp).value;
		const newAnswer = document.querySelector(DOM.esCardAnswerInp).value; 
		const cardIndex = DeckCtrl.logData().activeCard - 1;
		const currentCardData = DeckCtrl.logData().activeDeck.cards[cardIndex];
		currentCardData.question = newQuestion;
		currentCardData.answer = newAnswer;
	};

	const esDeleteCardBtn = (e) => {
		e.preventDefault();
		const card = e.target.parentElement.parentElement.parentElement;
		if (!e.target.classList.contains('delete-card-btn')) return;
		if (!card.classList.contains('active')) return;
		const activeCard = DeckCtrl.logData().activeCard;
		const activeDeck = DeckCtrl.logData().activeDeck;
		const cardID = DeckCtrl.logData().activeCardID
		DeckCtrl.deleteCard(activeDeck, cardID);
		UICtrl.esDeleteCardFromSlider(e);
		let newCardID
		if (activeCard > activeDeck.cards.length) {
			DeckCtrl.logData().activeCard--;
			UICtrl.esShowPrevCard();
			newCardID = activeCard > 2 ? newCardID = activeDeck.cards[activeCard - 2].id : 0;
		} else {
			UICtrl.esShowNextCard();
			newCardID = activeCard > 0 ? newCardID = activeDeck.cards[activeCard - 1].id : 0;
		};
		UICtrl.esShowDeckNav();
		UICtrl.esSetCardIndexInpText();
		UICtrl.esSetDeckLengthLabText();
		UICtrl.esDisplayCardInInputFields();
		DeckCtrl.logData().activeCardID = newCardID;
	};

	const esCardSliderIndexInpNav = (e) => {		
		const target = e.target;
		if (!target.classList.contains('card-nav__index-input')) return;
		let cardIndexVal = target.value;
		const activeDeck = DeckCtrl.logData().activeDeck;
		const deckLength = activeDeck.cards.length;
		target.value  
			= cardIndexVal > deckLength + 1
			? deckLength + 1
			: cardIndexVal === '0'
			? 1
			: cardIndexVal;
		cardIndexVal = target.value;
		const activeCard = (deckLength + 1) - cardIndexVal;
		DeckCtrl.logData().activeCard = activeCard;
		// TODO: Fix ghost card
		DeckCtrl.logData().activeCardID = cardIndexVal <= deckLength ? activeDeck.cards[activeCard - 1].id : 0;
		UICtrl.esNavDeckByIndexInp(activeCard);
		UICtrl.esShowDeckNav();
		UICtrl.esShowAddCardBtn();
		UICtrl.esShowEditCardBtn();
		UICtrl.esDisplayCardInInputFields();
		UICtrl.esResetPreviewCardText();
	};

	const esSaveChangesSubmit = () => {
		const DOM = UICtrl.getSelectors();
		const activeDeck = DeckCtrl.logData().activeDeck;
		if (!activeDeck.cards.length > 0) return;
		StorageCtrl.editDeck(activeDeck);
		UICtrl.navigateMainSection();
		DeckCtrl.clearData();
		UICtrl.clearInpVal(document.querySelector(DOM.csCardQuestionInp));
		UICtrl.clearInpVal(document.querySelector(DOM.csCardAnswerInp));
		UICtrl.addDeckToSelectMenu(DOM.msPracticeSectionMenu);
		UICtrl.addDeckToSelectMenu(DOM.msEditSectionMenu);
		UICtrl.addDeckToSelectMenu(DOM.msDeleteDeckMenu);
		UICtrl.addDeckToSelectMenu(DOM.msStatisticsSectionMenu);
	};

	// Delete Section
	const dsDeleteDeck = (e) => {
		// StorageCtrl.deleteDeck();
	}


	// Practice Section
	const selectDeckToPractice = (e) => {
		const storedDecks = JSON.parse(localStorage.getItem('decks'));
		const selectedDeck = storedDecks.filter(deck => deck.name === e.target.value)[0];
		DeckCtrl.logData().activeDeck = selectedDeck;
		DeckCtrl.logData().activeCard = 0;
	};
	const psEvalCardEasySubmit = (e) => {
		const activeCard = DeckCtrl.logData().activeCard;
		const activeDeck = DeckCtrl.logData().activeDeck;
		UICtrl.psShowNextCard();
		DeckCtrl.logData().activeCard++;
		UICtrl.psSetCounterCurrent();
		UICtrl.psSetCounterTotal();
		UICtrl.psSetProgressBar();
		if (activeCard + 2 === activeDeck.cards.length) {
			UICtrl.psHideCardEvaluation();
			UICtrl.psShowFinishPracticeBtn();
		};
	};
	const psEvalCardOkSubmit = (e) => {
		const activeCard = DeckCtrl.logData().activeCard;
		const activeDeck = DeckCtrl.logData().activeDeck;
		const currentCard = activeDeck.cards[(activeDeck.cards.length - 1) - activeCard];
		DeckCtrl.addCard(currentCard.question, currentCard.answer);
		UICtrl.psCreateCardUI();
		UICtrl.psShowNextCard();
		DeckCtrl.logData().activeCard++;
		UICtrl.psSetCounterCurrent();
		UICtrl.psSetCounterTotal();
		UICtrl.psSetProgressBar();
		if (activeCard + 2 === activeDeck.cards.length) {
			UICtrl.psHideCardEvaluation();
			UICtrl.psShowFinishPracticeBtn();
		};
	};
	const psEvalCardHardSubmit = (e) => {
		const activeCard = DeckCtrl.logData().activeCard;
		const activeDeck = DeckCtrl.logData().activeDeck;
		const currentCard = activeDeck.cards[(activeDeck.cards.length - 1) - activeCard];
		// const deckLength = activeDeck.cards.length;
		// const addIndex = (Math.round((deckLength - activeCard) / 2));
		const addIndex = activeCard + 2;
		DeckCtrl.addCard(currentCard.question, currentCard.answer);
		DeckCtrl.logData().activeDeck.cards.splice(addIndex, 0, currentCard);
		UICtrl.psCreateCardUI();
		UICtrl.psCreateCardUI();
		UICtrl.psInsertCardUI(addIndex);
		// UICtrl.psInsertCardUI(addIndex);
		UICtrl.psShowNextCard();
		DeckCtrl.logData().activeCard++;
		UICtrl.psSetCounterCurrent();
		UICtrl.psSetCounterTotal();
		UICtrl.psSetProgressBar();
		if (activeCard + 2 === activeDeck.cards.length) {
			UICtrl.psHideCardEvaluation();
			UICtrl.psShowFinishPracticeBtn();
		};

	};
	const psCardClick = (e) => {
		const target = e.target;
		if (!target.parentElement.parentElement.classList.contains('card--active')) return;
		if (target.classList.contains('card__inner--front')) {
			UICtrl.flipCardBack(target.parentElement);
		} else if (target.classList.contains('card__inner--back')) {
			UICtrl.flipCardFront(target.parentElement);
		};
	};
	const psFinishPracticeSubmit = () => {
		UICtrl.navigateMainSection();
		DeckCtrl.clearData();
		UICtrl.psSetProgressBar();
	};


	// Public methods
	return {
		init: function () {
			loadEventListeners();
			populateMenusWithLS();
		},
	};

})(StorageCtrl, DeckCtrl, UICtrl);

// Initialize App
AppCtrl.init();

