
Boxlayout = (->
  console.log "fuck"
  $el = $('#bl-main')
  $sections = $el.children('section')
  $sectionWork = $( '#bl-work-section')

  $workItems = $('#bl-work-items > li')
  $workPanelsContainer = $('#bl-panel-work-items')
  $workPanels = $workPanelsContainer.children('div')
  totalWorkPanels = $workPanels.length
  $nextWorkItem = $workPanelsContainer.find('nav >span.bl-next-work')
  isAnimating = false
  $closeWorkItem = $workPanelsContainer.find('nav > span.bl-icon-close')
  transEndEventNames = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition' : 'transitionend',
    'OTransition' : 'oTransitionEnd',
    'msTransition' : 'MSTransitionEnd',
    'transition' : 'transitionend'
  }
  transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ]
  supportTransitions = Modernizr.csstransitions
  currentWorkPanel = void
  face = $('#face')

  function init
    console.log "init"
    initEvents()

  function initEvents
    $sections.each( ->
      $section = $(this)
      # expand the clicked section and scale down the others
      $section.on( 'click', ->
        if( !$section.data('open'))       
          console.log "open"
          $section.data('open', true).addClass('bl-expand bl-expand-top')
          $el.addClass('bl-expand-item')
          face.removeClass("tada")
          face.addClass('face-hide')
        return )
      .find('span.bl-icon-close').on('click', ->
        console.log "close"
        # close the expanded section and scale up the others
        $section.data('open', false).removeClass('bl-expand').on( transEndEventName, (event) ->
          console.log event
          if ( !$(event.target).is('section') )
            return false 
          $(this).off(transEndEventName).removeClass( 'bl-expand-top')
          console.log "//////////////////////"
          console.log $(this)
          return)
        $section.removeClass('bl-expand-top') if  !supportTransitions
        $el.removeClass('bl-expand-item')
        face.removeClass('face-hide')
        # face.addClass('tada')

        return false)
    )
# // clicking on a work item: the current section scales down and the respective work panel slides up
    $workItems.on('click', (event) ->
      $sectionWork.addClass('bl-scale-down')
      $workPanelsContainer.addClass('bl-panel-items-show')
      $panel = $workPanelsContainer.find("[data-panel='" + $( this ).data( 'panel' ) + "']")
      currentWorkPanel := $panel.index()
      $panel.addClass('bl-show-work')
      console.log $panel
      return false)
# // navigating the work items: current work panel scales down and the next work panel slides up
    $nextWorkItem.on('click', (event) ->
      if( isAnimating)
        return false
      isAnimating := true

      $currentPanel = $workPanels.eq( currentWorkPanel )
      # currentWorkPanel := currentWorkPanel < currentWorkPanel -1 ? currentWorkPanel + 1: 0 
      if currentWorkPanel < (totalWorkPanels - 1)
        # console.log currentWorkPanel + 1
        currentWorkPanel := currentWorkPanel + 1
      else
        # console.log "else"
        # console.log currentWorkPanel
        currentWorkPanel := 0
      $nextPanel = $workPanels.eq( currentWorkPanel )
      $currentPanel.removeClass('bl-show-work').addClass('bl-hide-current-work')
      .on(transEndEventName, (event) ->
        if !$(event.target).is('div')
          return false
        $(this).off(transEndEventName).removeClass('bl-hide-current-work')
        isAnimating := false
        )
      if(!supportTransitions)
        $currentPanel.removeClass('bl=bl-hide-current-work')
        isAnimating := false
      $nextPanel.addClass('bl-show-work')
      return false
      )
    $closeWorkItem.on( 'click', (event) ->
      $sectionWork.removeClass( 'bl-scale-down' )
      $workPanelsContainer.removeClass( 'bl-panel-items-show' )
      console.log currentWorkPanel
      $workPanels.eq( currentWorkPanel ).removeClass( 'bl-show-work' )
      return)

    worksection = $('#bl-work-section')
    aboutsection = $('#about-section')
    eyes = $('#eyes')
    worksection.on('mouseover', ->
      console.log "work in"
      eyes.addClass('lookright')
      # console.log eyes
      )
    worksection.on('mouseleave', ->
      console.log "work out"
      eyes.removeClass('lookright')
      )
    aboutsection.on('mouseover', ->
      console.log "about in"
      eyes.addClass('lookleft')
      )
    aboutsection.on('mouseleave', ->
      console.log "about out"
      eyes.removeClass('lookleft')
      )
    $('.inner').on('mouseover', ->
      eyes.addClass('lookdown')
      )
    $('.inner').on('mouseleave', ->
      eyes.removeClass('lookdown')
      )

    return




  return { init : init }
  )()

# $(function() {
#         Boxlayout.init();
#       });
# $(->
#   boxLayout.init()
#   )
# $(document).ready(->
#   console.log "ready"
#   boxLayout.init()
#   return
# )