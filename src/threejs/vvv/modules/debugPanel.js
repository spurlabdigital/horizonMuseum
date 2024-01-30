import GUI from 'lil-gui'

export default class DebugPanel extends GUI {
  constructor(PanelName = 'Debug') {
    super()

    let initStyle
    if (document.getElementById(PanelName)) {
      initStyle = document.getElementById(PanelName).attributes.style.value
      document.getElementById(PanelName).remove()
    }
    this.domElement.id = PanelName
    this.domElement.style = initStyle
    // this.domElement.style.display = 'none'
    this.title(PanelName)

    const moveHandler = document.createElement('div')
    moveHandler.style.cursor = 'move'
    moveHandler.style.width = '75%'
    moveHandler.style.height = '26px'
    moveHandler.style.right = '0'
    moveHandler.style.position = 'absolute'
    moveHandler.style.zIndex = '100'
    moveHandler.style.top = '0'

    this.domElement.onmousedown = () => {
      const allPanels = document.getElementsByClassName('lil-gui root')
      Array.from(allPanels).forEach((panel) => {
        panel.style.zIndex = '100'
      })

      this.domElement.style.zIndex = '1001'
    }
    this.close()
    this.domElement.insertBefore(moveHandler, this.domElement.children[0])
    this.makeDraggable(this.domElement)
  }

  addPosition(object) {
    const folder = this.addFolder('Position')
    folder.add(object.position, 'x', -10, 10, 0.01)
    folder.add(object.position, 'y', -10, 10, 0.01)
    folder.add(object.position, 'z', -10, 10, 0.01)
  }

  addRotation(object) {
    const folder = this.addFolder('Rotation')
    folder.add(object.rotation, 'x', 0, Math.PI * 2, 0.01)
    folder.add(object.rotation, 'y', 0, Math.PI * 2, 0.01)
    folder.add(object.rotation, 'z', 0, Math.PI * 2, 0.01)
  }

  addScale(object) {
    const folder = this.addFolder('Scale')
    folder
      .add(object.scale, 'x', 0, Math.PI * 2, 0.01)
      .onChange(() => {
        object.scale.y = object.scale.x
        object.scale.z = object.scale.x
      })
      .name('UniScale')

    folder.add(object.scale, 'x', 0, 100, 0.01)
    folder.add(object.scale, 'y', 0, 100, 0.01)
    folder.add(object.scale, 'z', 0, 100, 0.01)
  }

  makeDraggable(elmnt) {
    // Make an element draggable (or if it has a .window-top class, drag based on the .window-top element)
    let currentPosX = 0,
      currentPosY = 0,
      previousPosX = 0,
      previousPosY = 0

    elmnt.children[0].onmousedown = dragMouseDown

    function dragMouseDown(e) {
      // Prevent any default action on this element (you can remove if you need this element to perform its default action)
      e.preventDefault()
      // Get the mouse cursor position and set the initial previous positions to begin
      previousPosX = e.clientX
      previousPosY = e.clientY
      // When the mouse is let go, call the closing event
      document.onmouseup = closeDragElement
      // call a function whenever the cursor moves
      document.onmousemove = elementDrag
    }

    function elementDrag(e) {
      // Prevent any default action on this element (you can remove if you need this element to perform its default action)
      e.preventDefault()
      // Calculate the new cursor position by using the previous x and y positions of the mouse
      currentPosX = previousPosX - e.clientX
      currentPosY = previousPosY - e.clientY
      // Replace the previous positions with the new x and y positions of the mouse
      previousPosX = e.clientX
      previousPosY = e.clientY
      // Set the element's new position
      elmnt.style.top = elmnt.offsetTop - currentPosY + 'px'
      elmnt.style.left = elmnt.offsetLeft - currentPosX + 'px'
    }

    function closeDragElement() {
      // Stop moving when mouse button is released and release events
      document.onmouseup = null
      document.onmousemove = null
    }
  }
}
