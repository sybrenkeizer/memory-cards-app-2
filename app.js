// Storage Controller
const StorageCtrl = (function() {

})();





// Card Controller
const CardCtrl = (function() {

})();





// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    cube: '.cube',
    mainSection: '.cube__side--main',
    createSection: '.cube__side--create',
    editSection: '.cube__side--edit',
    practiceSection: '.cube__side--practice',
    statisticsSection: '.cube__side--statistics',

    mainMenuBtns: '#form__main-menu button',
    exitSectionBtn: '.section__exit-btn'
  }

  // Public methods
  return {
    getSelectors: function() {
      return UISelectors;
    }

  }
})();


// App Controller
const AppCtrl = (function(StorageCtrl, CardCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();
    // Navigate sections
    document.querySelectorAll(UISelectors.mainMenuBtns).forEach(btn => btn.addEventListener('click', navigateSection));
    // Exit section
    document.querySelectorAll(UISelectors.exitSectionBtn).forEach(btn => btn.addEventListener('click', exitSection));
  }
  
  
  const navigateSection = function(e) {
    e.preventDefault(); 
    const UISelectors = UICtrl.getSelectors();
    const cube = UISelectors.cube;
    
    switch(e.target.id) {
      case 'practice-deck__btn':
        document.querySelector(cube).style.transform = 'rotateX(-90deg)';
        break;
      case 'create-deck__btn':
        document.querySelector(cube).style.transform = 'rotateY(-90deg)';
        break;
      case 'edit-deck__btn':
        document.querySelector(cube).style.transform = 'rotateY(90deg)';
        break;
      case 'statistics-deck__btn':
        document.querySelector(cube).style.transform = 'rotateX(90deg)';
        break;
    }
  }

  const navigatePracticeSection = function(e) {
    e.preventDefault();
    
  }

  const exitSection = function(e) {
    e.preventDefault();


  }


  // Public methods
  return {
    init: function() {
      loadEventListeners();



    }
  } 


})(StorageCtrl, CardCtrl, UICtrl);



// Initialize App
AppCtrl.init();