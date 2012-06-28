function ddg_spice_khan_academy(res) {

  // Make sure a property is defined on an object
  function isProp(obj, prop) {
    prop = prop.split('.')
    for (var i = 0, len = prop.length; i < len; i++) {
      if ((obj = obj[prop[i]]) === undefined)
        return false
    }
    return true
  }

  // If we have a videos to display
  if (res && isProp(res, 'feed.entry') && res.feed.entry.length > 0) {

    var LI_WIDTH = 168

    var vids = res.feed.entry
    var title = 'Khan Academy Videos'

    var div = d.createElement('div')
    div.id = 'khan'

    var frame = d.createElement('div')
    frame.id = 'frame'

    var len = vids.length
    var end = LI_WIDTH * len

    var ul = d.createElement('ul')
    ul.id = 'slides'
    YAHOO.util.Dom.setStyle(ul, 'width', end + 'px')

    var i, li, img, a, id, vid, p, txt
    for (i = 0; i < len; i++) {
      li = d.createElement('li')
      YAHOO.util.Dom.addClass(li, 'item')

      vid = vids[i]
      if (!isProp(vid, 'id.$t')) continue
      id = vid.id.$t.split(':').pop()

      a = d.createElement('a')
      a.href = 'http://khanacademy.org/video?v=' + id

      img = d.createElement('img')
      if (!isProp(vid, 'media$group.media$thumbnail')) continue
      img.src = vid.media$group.media$thumbnail[0].url

      p = d.createElement('p')
      if (!isProp(vid, 'title.$t')) continue
      txt = d.createTextNode(vid.title.$t)
      p.appendChild(txt)

      a.appendChild(img)
      a.appendChild(p)

      li.appendChild(a)
      ul.appendChild(li)
    }

    frame.appendChild(ul)
    div.appendChild(frame)

    // gradient fades
    var gr = d.createElement('div')
    gr.id = 'gr'
    YAHOO.util.Dom.addClass(gr, 'grad')
    div.appendChild(gr)

    var gl = d.createElement('div')
    gl.id = 'gl'
    YAHOO.util.Dom.addClass(gl, 'grad')
    div.appendChild(gl)

    var win, inc, last, off = 0, off2, khanState = 0

    function pnClasses() {
      if (khanState > 0) YAHOO.util.Dom.removeClass('preva', 'npah')
      else YAHOO.util.Dom.addClass('preva', 'npah')

      if (khanState < last) YAHOO.util.Dom.removeClass('nexta', 'npah')
      else YAHOO.util.Dom.addClass('nexta', 'npah')

      YAHOO.util.Dom.setStyle('slides', 'padding-left', off + 'px')
      YAHOO.util.Dom.setStyle('gl', 'width', off + 'px')
      YAHOO.util.Dom.setStyle('gr', 'width', off2 + 'px')
    }

    function setup() {
      win = YAHOO.util.Dom.getRegion('frame').width
      inc = Math.floor(win / LI_WIDTH)
      last = Math.max(0, len - inc)

      var extra = win - (inc * LI_WIDTH)
      off = Math.floor(extra / 2)
      off2 = extra - off

      pnClasses()
    }

    function preventDefault(e) {
      e.preventDefault ? e.preventDefault() : event.returnValue = false
    }

    function wrapCB(next) {
      return function (e) {
        preventDefault(e)

        if (khanState === 0 && !next) return
        if (khanState === last && next) return

        khanState += (next ? 1 : -1) * inc

        // edge conditions when resizing
        if (khanState < 0) khanState = 0
        if (khanState > last) khanState = last

        var mar = '-' + (khanState * LI_WIDTH) + 'px'
        YAHOO.util.Dom.setStyle('slides', 'margin-left', mar)

        pnClasses()
      }
    }

    function makeNav(txt, id, next) {
      var na = d.createElement('a')
      na.appendChild(d.createTextNode(txt))
      na.href = '#'
      na.id = id
      YAHOO.util.Dom.addClass(na, 'npa')
      YAHOO.util.Event.addListener(na, 'click', wrapCB(next))
      div.appendChild(na) 
    }

    makeNav('>', 'nexta', true)
    makeNav('<', 'preva', false)

    var resize
    YAHOO.util.Event.addListener(window, 'resize', function () {
      clearTimeout(resize)
      resize = setTimeout(setup, 400)  // tune
    })

    var items = [{
      f: 1,
      a: div,
      h: title,
      s: 'Khan Academy',
      u: 'http://khanacademy.org/'
    }]
    nra(items, 0, true)  // add to page
    setup()

  }

}