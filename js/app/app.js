var Boxlayout;
Boxlayout = function(){
  var $el, $sections, $sectionWork, $workItems, $workPanelsContainer, $workPanels, totalWorkPanels, $nextWorkItem, isAnimating, $closeWorkItem, transEndEventNames, transEndEventName, supportTransitions, currentWorkPanel, face;
  console.log("fuck");
  $el = $('#bl-main');
  $sections = $el.children('section');
  $sectionWork = $('#bl-work-section');
  $workItems = $('#bl-work-items > li');
  $workPanelsContainer = $('#bl-panel-work-items');
  $workPanels = $workPanelsContainer.children('div');
  totalWorkPanels = $workPanels.length;
  $nextWorkItem = $workPanelsContainer.find('nav >span.bl-next-work');
  isAnimating = false;
  $closeWorkItem = $workPanelsContainer.find('nav > span.bl-icon-close');
  transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  };
  transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];
  supportTransitions = Modernizr.csstransitions;
  currentWorkPanel = void 8;
  face = $('#face');
  function init(){
    console.log("init");
    return initEvents();
  }
  function initEvents(){
    var worksection, aboutsection, eyes;
    $sections.each(function(){
      var $section;
      $section = $(this);
      return $section.on('click', function(){
        if (!$section.data('open')) {
          console.log("open");
          $section.data('open', true).addClass('bl-expand bl-expand-top');
          $el.addClass('bl-expand-item');
          face.removeClass("tada");
          face.addClass('face-hide');
        }
      }).find('span.bl-icon-close').on('click', function(){
        console.log("close");
        $section.data('open', false).removeClass('bl-expand').on(transEndEventName, function(event){
          console.log(event);
          if (!$(event.target).is('section')) {
            return false;
          }
          $(this).off(transEndEventName).removeClass('bl-expand-top');
          console.log("//////////////////////");
          console.log($(this));
        });
        if (!supportTransitions) {
          $section.removeClass('bl-expand-top');
        }
        $el.removeClass('bl-expand-item');
        face.removeClass('face-hide');
        return false;
      });
    });
    $workItems.on('click', function(event){
      var $panel;
      $sectionWork.addClass('bl-scale-down');
      $workPanelsContainer.addClass('bl-panel-items-show');
      $panel = $workPanelsContainer.find("[data-panel='" + $(this).data('panel') + "']");
      currentWorkPanel = $panel.index();
      $panel.addClass('bl-show-work');
      console.log($panel);
      return false;
    });
    $nextWorkItem.on('click', function(event){
      var $currentPanel, $nextPanel;
      if (isAnimating) {
        return false;
      }
      isAnimating = true;
      $currentPanel = $workPanels.eq(currentWorkPanel);
      if (currentWorkPanel < totalWorkPanels - 1) {
        currentWorkPanel = currentWorkPanel + 1;
      } else {
        currentWorkPanel = 0;
      }
      $nextPanel = $workPanels.eq(currentWorkPanel);
      $currentPanel.removeClass('bl-show-work').addClass('bl-hide-current-work').on(transEndEventName, function(event){
        if (!$(event.target).is('div')) {
          return false;
        }
        $(this).off(transEndEventName).removeClass('bl-hide-current-work');
        return isAnimating = false;
      });
      if (!supportTransitions) {
        $currentPanel.removeClass('bl=bl-hide-current-work');
        isAnimating = false;
      }
      $nextPanel.addClass('bl-show-work');
      return false;
    });
    $closeWorkItem.on('click', function(event){
      $sectionWork.removeClass('bl-scale-down');
      $workPanelsContainer.removeClass('bl-panel-items-show');
      console.log(currentWorkPanel);
      $workPanels.eq(currentWorkPanel).removeClass('bl-show-work');
    });
    worksection = $('#bl-work-section');
    aboutsection = $('#about-section');
    eyes = $('#eyes');
    worksection.on('mouseover', function(){
      console.log("work in");
      return eyes.addClass('lookright');
    });
    worksection.on('mouseleave', function(){
      console.log("work out");
      return eyes.removeClass('lookright');
    });
    aboutsection.on('mouseover', function(){
      console.log("about in");
      return eyes.addClass('lookleft');
    });
    aboutsection.on('mouseleave', function(){
      console.log("about out");
      return eyes.removeClass('lookleft');
    });
    $('.inner').on('mouseover', function(){
      return eyes.addClass('lookdown');
    });
    $('.inner').on('mouseleave', function(){
      return eyes.removeClass('lookdown');
    });
  }
  return {
    init: init
  };
}();