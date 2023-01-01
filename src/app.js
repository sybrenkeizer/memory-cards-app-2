// Add Card button click:
//	- Move current card to the left
//	- Set new card to the center
//	- Clear input fields
//	- Both input fields can not be empty
//	- Store card data (question and answer) in current active deck
// 	- Hide empty cards

// Create Deck button click:
//	- store deck in local storage
//	- navigate to main menu
//	- clear all crete section input fields and cards
//	- clear data object with temp deck and card data
//	- show deck in local storage in select menus

// Capitalize sentences

// Swipe cards left and right to edit

// Highlight/mark form control fields upon selection or focus




// Storage Controller
const StorageCtrl = (function () {

	// Public methods
	return {
		storeDeck: function(deck) {
			let decks;
			if (localStorage.getItem('decks') === null) {
				decks = [];
				decks.push(deck);
				localStorage.setItem('decks', JSON.stringify(decks));
			} else {
				// console.log(deck);
				decks = JSON.parse(localStorage.getItem('decks'));
				decks.push(deck);
				// console.log(decks);
				localStorage.setItem('decks', JSON.stringify(decks));
			}
		},
	}
})();

// Deck Controller
const DeckCtrl = (function () {
	// Deck constructor
	const Deck = function(id, name, card) {
		this.id = id;
		this.name = name;
		this.cards = [];
		this.addCard = function (card) {
			this.cards.push(card.id, card.question, card.answer);
		};
	}
	// Card constructor
	const Card = function(id, question, answer){
		this.id = id;
		this.question = question;
		this.answer = answer;
	}
	// Data constructor
	const data = {
		decks: [],
		activeDeck: 0,
		activeCard: 0,
	}

	// Public methods
	return {
		addDeck: function(name, card) {
			// Create ID
			let date = new Date();
			let ID =
				String(date.getSeconds()) +
				String(date.getMinutes()) +
				String(date.getHours()) +
				String(date.getDay()) +
				String(date.getMonth()) +
				String(date.getFullYear());

			// Create new deck
			newDeck = new Deck(ID, name, card);

			// Save new deck data
			data.decks.push(newDeck);

			// Return new deck
			return newDeck
		},
		addCard: function(question, answer) {
			// Create ID
			let date = new Date();
			let ID =
				String(date.getSeconds()) +
				String(date.getMinutes()) +
				String(date.getHours()) +
				String(date.getDay()) +
				String(date.getMonth()) +
				String(date.getFullYear());

			// Create new card
			newCard = new Card(ID, question, answer);

			// Append new card to deck data
			data.decks[data.decks.length-1].cards.unshift(newCard);

			// Return new card
			return newCard
		},
		logData: function() {
			return data
		},
		clearData: function() {
			data.decks = [];
			data.activeDeck = 0;
			data.activeCard = 0;
		}
	}
})();


// UI Controller
const UICtrl = (function () {
	const UISelectors = {
		cube: ".cube",
		mainSection: ".cube__side--main",
		createSection: ".cube__side--create",
		editSection: ".cube__side--edit",
		practiceSection: ".cube__side--practice",
		statisticsSection: ".cube__side--statistics",
		exitSectionBtn: ".section__exit-btn",
		MsPracticeSectionBtn: "#practice-deck__btn",
		MsCreateSectionBtn: "#create-deck__btn",
		MsCreateSectionInp: '#create-deck__name',
		MsEditSectionBtn: "#edit-deck__btn",
		MsEditSectionInp: '#edit-deck__menu',
		MsStatisticsSectionBtn: "#statistics-deck__btn",
		MsStatisticsSectionInp: '#statistics-deck__menu',
		CsCreateDeckNameInput: "#create-deck__name-input",
		CsDeckNameSectionTitle: "#create-deck-name",
		CsAddCardBtn: '#add-card-btn',
		CsDeleteCardBtn: '#delete-card-btn',
		CsEditCardBtn: '#edit-card-btn',
		CsCardQuestion: '#create-deck__question',
		CsCardAnswer: '#create-deck__answer',
		CsCardSlider: '#create-deck__cards-slider',
		CsCardSliderNavRight: '.card-nav__right',
		CsCardSliderNavLeft: '.card-nav__left',
		CsCardSliderIndex: '.card-nav__index-input',
		CsCardSliderIndexLabel: '.card-nav__index-label',
		CsCardActiveInner: '#create-deck__cards-slider .card.active .card__inner',
		CsCardActiveFront: '#create-deck__cards-slider .card.active .card__inner--front',
		CsCardActiveBack: '#create-deck__cards-slider .card.active .card__inner--back',
		CsStoreDeckBtn: '#store-deck-btn'
	};

	// Public methods
	return {
		getSelectors: () => UISelectors,
		clearInputField: function (element) {
			element.value = '';
		},
		printActiveCardFront: (e) => {
			const questionInput = document.querySelector(UISelectors.CsCardQuestion).value;
			questionInput.length > 80
				? document.querySelector(UISelectors.CsCardActiveFront).textContent = questionInput.substring(0, 80) + '...'
				: document.querySelector(UISelectors.CsCardActiveFront).textContent = questionInput;
		},
		printActiveCardBack: (e) => {
			const answerInput = document.querySelector(UISelectors.CsCardAnswer).value;
			answerInput.length > 80
				? document.querySelector(UISelectors.CsCardActiveBack).textContent = answerInput.substring(0, 80) + '...'
				: document.querySelector(UISelectors.CsCardActiveBack).textContent = answerInput;
		},
		clearActiveCardFront: (e) => {
			document.querySelector(UISelectors.CsCardActiveFront).textContent = '';
		},
		clearActiveCardBack: (e) => {
			document.querySelector(UISelectors.CsCardActiveBack).textContent = '';
		},
		flipCardFront: (card) => {
			card.style.transform = 'rotate(0)';
		},
		flipCardBack: (card) => {
			card.style.transform = 'rotateX(180deg)';
		},
		createCardsUI: (deck) => {
			const cardsSlider = document.querySelector(UISelectors.CsCardSlider);
			const div = document.createElement('DIV');
			div.className = 'card'
			div.innerHTML = `                
				<div class="card__inner">
					<div class="card__inner--front">
						<p class="card-question-text">${newCard.question}</p>
						<button class="delete-card-btn">x</button>
					</div>
					<div class="card__inner--back">
						<p class="card-answer">${newCard.answer}</p>
						<button class="delete-card-btn">x</button>
					</div>
				</div>
			`
			cardsSlider.prepend(div);
		},
		sortCardsUI: (deck) => {
			// 
			deck.cards.length > 0 && (document.querySelector(UISelectors.CsCardSlider).children[0].className = 'card prev')
			// Make new card active (set as first)
			deck.cards.length > 0 && (document.querySelector(UISelectors.CsCardSlider).children[1].className = 'card active')
			// Make former new card second in line (set as second)
			deck.cards.length > 0 && (document.querySelector(UISelectors.CsCardSlider).children[2].className = 'card first')
			// Make former second card third in line (set as third)
			deck.cards.length > 1 && (document.querySelector(UISelectors.CsCardSlider).children[3].className = 'card second')
			//  Make third card fourth in line (set as fourth)
			deck.cards.length > 2 && (document.querySelector(UISelectors.CsCardSlider).children[4].className = 'card third-and-up')
		},	
		updateCardIndex: () => {
			const cardSliderIndexEl = document.querySelector(UISelectors.CsCardSliderIndex);
			const cardSliderIndexLabelEl = document.querySelector(UISelectors.CsCardSliderIndexLabel);

			cardSliderIndexEl.value = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards.length - DeckCtrl.logData().activeCard + 1;

			cardSliderIndexLabelEl.innerHTML = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards.length;
		},
		displayCardInInputFields: () => {
			if (DeckCtrl.logData().activeCard > 0) {
				const question = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards[DeckCtrl.logData().activeCard - 1].question;
				const answer = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards[DeckCtrl.logData().activeCard - 1].answer;;
				document.querySelector(UISelectors.CsCardQuestion).value = question;
				document.querySelector(UISelectors.CsCardAnswer).value = answer;
			} else if (DeckCtrl.logData().activeCard === 0) {
				document.querySelector(UISelectors.CsCardQuestion).value = '';
				document.querySelector(UISelectors.CsCardAnswer).value = '';
				document.querySelector(UISelectors.CsCardQuestion).focus();
			}
		},
		showEditCardBtn: () => {
			if (DeckCtrl.logData().activeCard > 0) {
				document.querySelector(UISelectors.CsAddCardBtn).classList.remove('show');
				document.querySelector(UISelectors.CsEditCardBtn).classList.add('show');
			}
		},
		showAddCardBtn: () => {
			if (DeckCtrl.logData().activeCard === 0) {
				document.querySelector(UISelectors.CsAddCardBtn).classList.add('show');
				document.querySelector(UISelectors.CsEditCardBtn).classList.remove('show');
			}
		},
		removeCardsUI: () => {
			const cards = Array.from(document.querySelector(UISelectors.CsCardSlider).children)
			cards.forEach((card, index) => {
				if (index > 1 && index < cards.length - 1) {
					card.remove();
				}
			})
		},
		resetCardIndexCount: () => {
			document.querySelector(UISelectors.CsCardSliderIndex).value = 1;
			document.querySelector(UISelectors.CsCardSliderIndexLabel).textContent = 0;
		},
	}
})();

// App Controller
const AppCtrl = (function (StorageCtrl, DeckCtrl, UICtrl) {
	// Load event listeners
	const loadEventListeners = function () {
		const UISelectors = UICtrl.getSelectors();
		document
			.querySelector(UISelectors.MsPracticeSectionBtn)
			.addEventListener("click", navigatePracticeSection);
		document
			.querySelector(UISelectors.MsCreateSectionBtn)
			.addEventListener("click", (e) => {
				navigateCreateSection(e);
				createDeck(e);
				UICtrl.clearInputField(e.target.parentElement.firstElementChild);
			});
		document
			.querySelector(UISelectors.MsCreateSectionInp)
			.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					navigateCreateSection(e);
					createDeck(e);
					UICtrl.clearInputField(e.target.parentElement.firstElementChild);
				}
			});
		document
			.querySelector(UISelectors.MsEditSectionBtn)
			.addEventListener("click", navigateEditSection);
		document
			.querySelector(UISelectors.MsEditSectionInp)
			.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					navigateEditSection(e);
				}
			});
		document
			.querySelector(UISelectors.MsStatisticsSectionInp)
			.addEventListener("click", navigateStatisticsSection);
		document
			.querySelector(UISelectors.MsEditSectionBtn)
			.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					navigateStatisticsSection(e);
				}
			});
		document
			.querySelectorAll(UISelectors.exitSectionBtn)
			.forEach((btn) => btn.addEventListener("click", navigateMainSection));
		
		document
			.querySelector(UISelectors.CsCreateDeckNameInput)
			.addEventListener('input', (e) => {
				UICtrl.printActiveCardFront(e);
				CsUpdateDeckNameSectionTitle(e);
			});
		// Create new card
		document
			.querySelector(UISelectors.CsAddCardBtn)
			.addEventListener('click', (e) => {
				e.preventDefault();
				// Only continue when both fields have input
				if (document.querySelector(UISelectors.CsCardQuestion).value === '' || document.querySelector(UISelectors.CsCardAnswer).value === '') return;
				// Add card to data deck
				CsCreateNewCard(e);
				// Sort deck	
				UICtrl.sortCardsUI(DeckCtrl.logData().decks[0]);
				// Flip newly made card to front (question)
				UICtrl.flipCardFront(Array.from(document.querySelector(UISelectors.CsCardSlider).children)[2].firstElementChild);
				// Clear both input fields question and answer
				UICtrl.clearInputField(document.querySelector(UISelectors.CsCardQuestion));
				UICtrl.clearInputField(document.querySelector(UISelectors.CsCardAnswer));
				// Clear printed front and back side active card
				UICtrl.clearActiveCardFront(e);
				UICtrl.clearActiveCardBack(e);
				document.querySelector(UISelectors.CsCardQuestion).focus();
				showDeckNav(e);
			});
		// Add input to card
		document
			.querySelector(UISelectors.CsCardQuestion)
			.addEventListener('input', UICtrl.printActiveCardFront);
		document
			.querySelector(UISelectors.CsCardAnswer)
			.addEventListener('input', UICtrl.printActiveCardBack);
		// Flip Card
		document
			.querySelector(UISelectors.CsCardQuestion)
			.addEventListener('focus', () => {
				UICtrl.flipCardFront(document.querySelector(UISelectors.CsCardActiveInner));
			});
		document
			.querySelector(UISelectors.CsCardAnswer)
			.addEventListener('focus', () => {
				UICtrl.flipCardBack(document.querySelector(UISelectors.CsCardActiveInner));
			});
		document
			.querySelector(UISelectors.CsCardSlider)
			.addEventListener('click', (e) => {
				if (e.target.parentElement.parentElement.className === 'card active') {
					if (e.target.className === 'card__inner--front') {
						UICtrl.flipCardBack(e.target.parentElement);
						document.querySelector(UISelectors.CsCardAnswer).select();
					} else if (e.target.className === 'card__inner--back') {
						UICtrl.flipCardFront(e.target.parentElement);
						document.querySelector(UISelectors.CsCardQuestion).select();
					}
				}
			});
		document
			.querySelector(UISelectors.CsEditCardBtn)
			.addEventListener('click', CsEditCard);
		document
			.querySelector(UISelectors.CsStoreDeckBtn)
			.addEventListener('click', (e) => {
				if (DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards.length > 0) {
					StorageCtrl.storeDeck(DeckCtrl.logData().decks[0]);
					navigateMainSection(e);
					DeckCtrl.clearData();
					UICtrl.removeCardsUI();
					UICtrl.resetCardIndexCount();
				}	
			});
		document
			.querySelector(UISelectors.CsCardSliderIndex)
			.addEventListener('input', deckNavByIndex);
		// Hide delete button on not existing card
		
	};

	
	// Navigate sections
	const navigatePracticeSection = (e) => {
		e.preventDefault();
		const inputDeckCreate = e.target.parentElement.firstElementChild.value;
		if (!inputDeckCreate) return;
		const cube = UICtrl.getSelectors().cube;
		document.querySelector(cube).style.transform = "rotateX(-90deg)";
	};
	const navigateCreateSection = (e) => {
		e.preventDefault();
		const inputDeckCreate = e.target.parentElement.firstElementChild.value;
		if (!inputDeckCreate) return;
		const cube = UICtrl.getSelectors().cube;
		document.querySelector(cube).style.transform = "rotateY(-90deg)";
	};
	const navigateEditSection = (e) => {
		e.preventDefault();
		const inputDeckCreate = e.target.parentElement.firstElementChild.value;
		if (!inputDeckCreate) return;
		const cube = UICtrl.getSelectors().cube;
		document.querySelector(cube).style.transform = "rotateY(90deg)";
	};
	const navigateStatisticsSection = (e) => {
		e.preventDefault();
		const inputDeckCreate = e.target.parentElement.firstElementChild.value;
		if (!inputDeckCreate) return;
		const cube = UICtrl.getSelectors().cube;
		document.querySelector(cube).style.transform = "rotateX(90deg)";
	};
	const navigateMainSection = (e) => {
		e.preventDefault();
		const cube = UICtrl.getSelectors().cube;
		document.querySelector(cube).style.transform = "rotate(0)";
	};
	// Create deck
	const createDeck = (e) => {
		const createDeckName = e.target.parentElement.firstElementChild.value;
		const UISelectors = UICtrl.getSelectors();
		const deckName = DeckCtrl.addDeck(createDeckName).name;
		document.querySelector(UISelectors.CsCreateDeckNameInput).value = deckName;
		document.querySelector(UISelectors.CsDeckNameSectionTitle).textContent = deckName;
	};
	// Update deck title
	const CsUpdateDeckNameSectionTitle = (e) => {
		const UISelectors = UICtrl.getSelectors();
		document.querySelector(UISelectors.CsDeckNameSectionTitle).textContent = document.querySelector(UISelectors.CsCreateDeckNameInput).value;
	}
	// Create card
	const CsCreateNewCard = (e) => {
		e.preventDefault();
		const UISelectors = UICtrl.getSelectors();
		const CsCardQuestion = document.querySelector(UISelectors.CsCardQuestion).value;
		const CsCardAnswer = document.querySelector(UISelectors.CsCardAnswer).value;
		const newCard = DeckCtrl.addCard(CsCardQuestion, CsCardAnswer);
		UICtrl.createCardsUI(DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck]);
		UICtrl.updateCardIndex();
	};
	// Navigate cards
	const showDeckNav = () => {
		const UISelectors = UICtrl.getSelectors();
		const cardNavRight = document.querySelector(UISelectors.CsCardSliderNavRight);
		const cardNavLeft = document.querySelector(UISelectors.CsCardSliderNavLeft);

		// Add arrow right
		if (DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards.length > DeckCtrl.logData().activeCard) {
			cardNavRight.classList.add('show');
			cardNavRight.addEventListener('click', showNextCard);
		} else {
			cardNavRight.classList.remove('show');
		}

		// Add arrow left
		if (DeckCtrl.logData().activeCard > 0) {
			cardNavLeft.classList.add('show');
			cardNavLeft.addEventListener('click', showPreviousCard);
		} else {
			cardNavLeft.classList.remove('show');
		}
	};
	
	const showNextCard = (e) => {
		const UISelectors = UICtrl.getSelectors();
		DeckCtrl.logData().activeCard++;
		let activeCard = DeckCtrl.logData().activeCard;
		showDeckNav();
		UICtrl.updateCardIndex();
		Array.from(document.querySelector(UISelectors.CsCardSlider).children).forEach((child, index) => {
			if (index === 3 + activeCard && !child.classList.contains('card-nav')) {
				child.className = 'card second'
			};
			if (index === 2 + activeCard && !child.classList.contains('card-nav')) {
				child.className = 'card first'
			};
			if (index === 1 + activeCard && !child.classList.contains('card-nav')) {
				child.className = 'card active'
			};
			if (index === 0 + activeCard && !child.classList.contains('card-nav')) {
				child.className = 'card prev'
			};
		})
		UICtrl.displayCardInInputFields();
		UICtrl.showAddCardBtn();
		UICtrl.showEditCardBtn();


		// Reset card question & answer text when chosen to not edit
		if (DeckCtrl.logData().activeCard > 1) {
			const lastCard = document.querySelector(UISelectors.CsCardSlider).children[DeckCtrl.logData().activeCard];
			lastCard.firstElementChild.children[0].textContent = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards[DeckCtrl.logData().activeCard - 2].question;
			lastCard.firstElementChild.children[1].textContent = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards[DeckCtrl.logData().activeCard - 2].answer;
		};
	};
	const showPreviousCard = (e) => {
		const UISelectors = UICtrl.getSelectors();
		DeckCtrl.logData().activeCard--;
		let activeCard = DeckCtrl.logData().activeCard;
		showDeckNav();
		UICtrl.updateCardIndex();
		Array.from(document.querySelector(UISelectors.CsCardSlider).children).forEach((child, index) => {
			if (!child.classList.contains('card-nav')) {
				if (index === 4 + activeCard) {
					child.className = 'card third-and-up'
				};
				if (index === 3 + activeCard) {
					child.className = 'card second'
				};
				if (index === 2 + activeCard) {
					child.className = 'card first'
				};
				if (index === 1 + activeCard) {
					child.className = 'card active'
				};
				if (index === 0 + activeCard) {
					child.className = 'card prev'
				};	
			};
		});
		UICtrl.displayCardInInputFields();
		UICtrl.showAddCardBtn();
		UICtrl.showEditCardBtn();

		
		// Reset card question & answer text when chosen to not edit
		if (DeckCtrl.logData().activeCard > 1) {
			const lastCard = document.querySelector(UISelectors.CsCardSlider).children[DeckCtrl.logData().activeCard + 2];
			lastCard.firstElementChild.children[0].textContent = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards[DeckCtrl.logData().activeCard].question;
			lastCard.firstElementChild.children[1].textContent = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards[DeckCtrl.logData().activeCard].answer;
		};
	};
	const deckNavByIndex = (e) => {
		const UISelectors = UICtrl.getSelectors();
		e.preventDefault();

		let inputValue;
		const deckLength = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards.length;

		if (e.target.value > deckLength + 1) {
			inputValue = deckLength + 1;
			e.target.value = deckLength + 1;
		} else {
			inputValue = e.target.value;
		}
		DeckCtrl.logData().activeCard = (deckLength + 1) - inputValue;
		const activeCard = DeckCtrl.logData().activeCard;
		if (!inputValue || inputValue > deckLength + 1) return;

		Array.from(document.querySelector(UISelectors.CsCardSlider).children).forEach((child, index) => {
			if (child.classList.contains('prev') ||
				child.classList.contains('active') ||
				child.classList.contains('first') ||
				child.classList.contains('second')) {
				child.className = 'card';
			}
			if (index === 3 + activeCard && !child.classList.contains('card-nav')) {
			child.className = 'card second'
		};
			if (index === 2 + activeCard && !child.classList.contains('card-nav')) {
				child.className = 'card first'
			};
			if (index === 1 + activeCard && !child.classList.contains('card-nav')) {
				child.className = 'card active'
			};
			if (index === 0 + activeCard && !child.classList.contains('card-nav')) {
				child.className = 'card prev'
			};
		})
		showDeckNav();
		UICtrl.showAddCardBtn();
		UICtrl.showEditCardBtn();
		UICtrl.displayCardInInputFields();
	};
	const CsEditCard = (e) => {
		e.preventDefault();
		const UISelectors = UICtrl.getSelectors();
		const newQuestion = document.querySelector(UISelectors.CsCardQuestion).value;
		const newAnswer = document.querySelector(UISelectors.CsCardAnswer).value; 
		const cardIndex = DeckCtrl.logData().activeCard - 1;
		const currentDeckData = DeckCtrl.logData().decks[DeckCtrl.logData().activeDeck].cards[cardIndex];
		currentDeckData.question = newQuestion;
		currentDeckData.answer = newAnswer;
	};




	// Store deck
	const CsStoreDeck = (e) => {
		e.preventDefault();

			// Store active deck to local storage
			// Check for clearing all UI input in create-section 
	} 



	// Public methods
	return {
		init: function () {
			loadEventListeners();
		},
	};
})(StorageCtrl, DeckCtrl, UICtrl);

// Initialize App
AppCtrl.init();
