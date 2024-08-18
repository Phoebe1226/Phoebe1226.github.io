let marqueeX = 0
let currentScroll = window.pageYOffset

const marquee = document.querySelector("div.marquee")
marquee.innerHTML += marquee.innerHTML
marquee.innerHTML += marquee.innerHTML

innerTags = marquee.querySelectorAll("ul.inner")

innerTags.forEach((inner, index) => {
  inner.style.left = (inner.offsetWidth * index) + "px"
})

const draw = function () {
  let newScroll = window.pageYOffset
  let diffScroll = newScroll - currentScroll
  let skew = diffScroll * 0.4

  marquee.style.transform = `skewX(${skew}deg)`

  currentScroll = newScroll

  marqueeX -= 1


  innerTags.forEach((inner, index) => {
    let width = inner.offsetWidth

    // code from https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
    let normalizedMarqueeX = ((marqueeX % width) + width) % width
    let pos = (width * (index - 1)) + normalizedMarqueeX

    inner.style.left = pos + "px"
  })

  requestAnimationFrame(draw)
}

draw()
