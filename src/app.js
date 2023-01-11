//! BUGS
// - section navigation on keypress enter not working 

// TODO : Add methods to deck controller to deal with data updates
// TODO : Trim UI selectors
// TODO : Join all cardslider event listeners together?


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
	}
})();

// DECK CONTROLLER
const DeckCtrl = (function () {
	const Deck = function(id, name) {
		this.id = id;
		this.name = name;
		this.cards = [];
		this.addCard = function(card) {
			this.cards.push(card.id, card.question, card.answer);
		};
	}
	const Card = function(id, question, answer) {
		this.id = id;
		this.question = question;
		this.answer = answer;
	}
	const data = {
		decks: [], // Take data from local storage
		activeDeck: 0,
		activeCard: 0,
		activeCardID: 0
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
			data.decks.push(newDeck);
			return newDeck;
		},
		addCard: (question, answer) => {
			let ID = DeckCtrl.createID();
			newCard = new Card(ID, question, answer);
			data.decks[data.decks.length-1].cards.unshift(newCard);
			return newCard;
		},
		deleteCard: (deck, id) => {
			const cards = deck.cards;
			cards.forEach((card, index) => card.id === id && cards.splice(index, 1));
		},
		clearData: function() {
			data.decks = [];
			data.activeDeck = 0;
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
		csAddCardBtn: '#add-card-btn',
		csEditCardBtn: '#edit-card-btn',
		csCardQuestionInp: '#create-deck__question',
		csCardAnswerInp: '#create-deck__answer',
		csCardSlider: '#create-deck__cards-slider',
		csCardNavBtnRight: '.card-nav__right',
		csCardNavBtnLeft: '.card-nav__left',
		csCardSliderIndexInp: '#card-nav__index-input',
		csCardSliderIndexLab: '.card-nav__index-label',
		csCardActiveInner: '#create-deck__cards-slider .card.active .card__inner',
		csCardActiveFront: '#create-deck__cards-slider .card.active .card-question-text',
		csCardActiveBack: '#create-deck__cards-slider .card.active .card-answer-text',
		csCardActiveDeleteBtn: '#create-deck__cards-slider .card.active .delete-card-btn',
		csStoreDeckBtn: '#store-deck-btn',
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
		addDeckToSelectMenu: (menu, deck) => {
			const menuEL = document.querySelector(menu);
			const option = document.createElement('OPTION');
			option.value = deck.name;
			option.textContent = deck.name;
			menuEL.appendChild(option);
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
			const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards;
			const activeCard = DeckCtrl.logData().activeCard;
			activeDeck.length > activeCard
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
			const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck];
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
			const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck];
			const lastCard = document.querySelector(UISelectors.csCardSlider).children[activeCard];
			const lastCardQuestion = lastCard.firstElementChild.children[0].firstElementChild;
			const lastCardAnswer = lastCard.firstElementChild.children[1].firstElementChild;
			//! Quick Fix: preview card should return cleared if card is not added.
			lastCardQuestion.textContent = '';
			lastCardAnswer.textContent = '';
			if (activeCard - 1 > 0) {
				lastCardQuestion.textContent = activeDeck.cards[activeCard - 2].question;
				lastCardAnswer.textContent = activeDeck.cards[activeCard - 2].answer;
			}
		},
		csResetNextLastCardText: () => {
			const activeCard = DeckCtrl.logData().activeCard;
			const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck];
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
			const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards;
			const activeCard = DeckCtrl.logData().activeCard;
			cardSliderIndexInpEl.value = activeDeck.length - activeCard + 1;
		},
		csSetDeckLengthLabText: () => {
			const activeDeck = DeckCtrl.logData().activeDeck;
			const activeDeckLength = DeckCtrl.logData().decks[activeDeck].cards.length;
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
				<div class="card-nav__right">)</div>
				<div class="card-nav__left">(</div>
				<div class="card-nav__index">
					<input type="number" id="card-nav__index-input" class="card-nav__index-input" value="1">
					<label for="card-nav__index-input" id="card-nav__index-label" class="card-nav__index-label">0</label>
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
		}

	}
})();

// APP CONTROLLER
const AppCtrl = (function (StorageCtrl, DeckCtrl, UICtrl) {
	// EVENT LISTENERS	
	const loadEventListeners = () => {
		const DOM = UICtrl.getSelectors();
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
		document
			.querySelector(DOM.msStatisticsSectionBtn)
			.addEventListener('click', msStatisticsSectionSubmit);
		document
			.querySelector(DOM.msStatisticsSectionMenu)
			.addEventListener("keypress", msStatisticsSectionMenuKeyEnter);
		document
			.querySelectorAll(DOM.exitSectionBtn)
			.forEach((btn) => btn.addEventListener("click", exitSectionSubmit));
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
	};

	
	// FUNCTIONS
	const msPracticeSectionSubmit = (e) => {
		e.preventDefault();
		const msPracticeSectionInpVal = e.target.parentElement.firstElementChild.value;
		if (!msPracticeSectionInpVal) return
		UICtrl.navigatePracticeSection(e);
	};
	
	const msPracticeSectionMenuKeyEnter = (e) => {
		const msPracticeSectionInpVal = e.target.value;
		if (!msPracticeSectionInpVal || e.key !== 'Enter') return;
		UICtrl.navigatePracticeSection(e);
	};

	const msCreateSectionSubmit = (e) => {
		e.preventDefault();
		const UISelectors = UICtrl.getSelectors();
		if (!document.querySelector(UISelectors.msCreateSectionInp).value) return;
		UICtrl.csClearDeckUI();
		UICtrl.csSetupDeckSliderUI();
		UICtrl.navigateCreateSection(e);
		DeckCtrl.addDeck(document.querySelector(UISelectors.msCreateSectionInp).value);
		UICtrl.csPrintTitle(document.querySelector(UISelectors.msCreateSectionInp).value);
		UICtrl.csPrintDeckName(document.querySelector(UISelectors.msCreateSectionInp).value);
		UICtrl.clearInpVal(document.querySelector(UISelectors.msCreateSectionInp));
	};
	
	const msCreateSectionMenuKeyEnter = (e) => {
		const UISelectors = UICtrl.getSelectors();
		const msCreateSectionInpVal = e.target.value;
		if (!msCreateSectionInpVal || e.key !== 'Enter') return;
		UICtrl.csClearDeckUI();
		UICtrl.csSetupDeckSliderUI();
		UICtrl.navigateCreateSection(e);
		DeckCtrl.addDeck(msCreateSectionInpVal);
		UICtrl.csPrintTitle(msCreateSectionInpVal);
		UICtrl.csPrintDeckName(msCreateSectionInpVal);
		UICtrl.clearInpVal(e.target);
	};

	const msEditSectionSubmit = (e) => {
		e.preventDefault();
		const msEditSectionInpVal = e.target.parentElement.firstElementChild.value;
		if (!msEditSectionInpVal) return;
		UICtrl.navigateEditSection(e);
	};

	const msEditSectionMenuKeyEnter = (e) => {
		const msEditSectionInpVal = e.target.value;
		if (!msEditSectionInpVal || !e.key === 'Enter') return;
		UICtrl.navigateEditSection(e);
	};

	const msDeleteDeckSubmit = (e) => {
		e.preventDefault();
		const msDeleteSectionInpVal = e.target.parentElement.firstElementChild.value;
		if (!msDeleteSectionInpVal) return;
	}

	const msDeleteDeckMenuKeyEnter = (e) => {
		const msDeleteDeckInpVal = e.target.value;
		if (!msDeleteDeckInpVal || !e.key === 'Enter') return;
	};

	const msStatisticsSectionSubmit = (e) => {
		e.preventDefault();
		const msStatisticsSectionInpVal = e.target.parentElement.firstElementChild.value;
		if (!msStatisticsSectionInpVal) return;
	};

	const msStatisticsSectionMenuKeyEnter = (e) => {
		const msStatisticsSectionInpVal = e.target.value;
		if (!msStatisticsSectionInpVal || !e.key === 'Enter') return;
		UICtrl.navigateStatisticsSection(e);
	};

	const exitSectionSubmit = () => {
		UICtrl.navigateMainSection();
	};		

	const csCreateDeckNameInp = () => {
		const UISelectors = UICtrl.getSelectors();
		const deckNameInp = document.querySelector(UISelectors.csCreateDeckNameInp).value;
		UICtrl.csUpdateSectionTitle(deckNameInp);
		DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].deckName = deckNameInp;
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
		const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck];
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
		if (e.target.classList.contains('card-nav__right')) {
			DeckCtrl.logData().activeCard++;
			UICtrl.csShowNextCard();
			UICtrl.csResetPrevLastCardText();
		};
		if (e.target.classList.contains('card-nav__left')) {
			DeckCtrl.logData().activeCard--;
			UICtrl.csShowPrevCard();
			UICtrl.csResetNextLastCardText();
		};
		const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck];
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
		} else if (target.classList.contains('card__inner--back')) {
			UICtrl.flipCardFront(target.parentElement);
		};
	};
	
	const csEditCardSubmit = (e) => {
		e.preventDefault();
		const DOM = UICtrl.getSelectors();
		const newQuestion = document.querySelector(DOM.csCardQuestionInp).value;
		const newAnswer = document.querySelector(DOM.csCardAnswerInp).value; 
		const cardIndex = DeckCtrl.logData().activeCard - 1;
		const currentCardData = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards[cardIndex];
		currentCardData.question = newQuestion;
		currentCardData.answer = newAnswer;
	};

	// TODO : Need proper refactoring 
	const csDeleteCardBtn = (e) => {
		e.preventDefault();
		const card = e.target.parentElement.parentElement.parentElement;
		if (!e.target.classList.contains('delete-card-btn')) return;
		if (!card.classList.contains('active')) return;
		const activeCard = DeckCtrl.logData().activeCard;
		const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck];
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
		const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck];
		console.log(activeDeck);
		if (!activeDeck.cards.length > 0) return;
		StorageCtrl.storeDeck(activeDeck);
		UICtrl.navigateMainSection();
		DeckCtrl.clearData();
		// UICtrl.clearInpVal(document.querySelector(DOM.csCardQuestionInp));
		// UICtrl.clearInpVal(document.querySelector(DOM.csCardAnswerInp));
		UICtrl.addDeckToSelectMenu(DOM.msPracticeSectionMenu, activeDeck);
		UICtrl.addDeckToSelectMenu(DOM.msEditSectionMenu, activeDeck);
		UICtrl.addDeckToSelectMenu(DOM.msDeleteDeckMenu, activeDeck);
		UICtrl.addDeckToSelectMenu(DOM.msStatisticsSectionMenu, activeDeck);
	}

	const populateMenusWithLS = () => {
		const DOM = UICtrl.getSelectors();
		JSON.parse(localStorage.getItem('decks')) &&
		JSON.parse(localStorage.getItem('decks')).forEach(deck => {
			UICtrl.addDeckToSelectMenu(DOM.msPracticeSectionMenu, deck);
			UICtrl.addDeckToSelectMenu(DOM.msEditSectionMenu, deck);
			UICtrl.addDeckToSelectMenu(DOM.msDeleteDeckMenu, deck);
			UICtrl.addDeckToSelectMenu(DOM.msStatisticsSectionMenu, deck);
		});
	};

	// TODO: Need proper refactoring 
	const csCardSliderIndexInpNav = (e) => {		
		const target = e.target;
		if (!target.classList.contains('card-nav__index-input')) return;
		let cardIndexVal = target.value;
		const activeDeck = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck];
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
