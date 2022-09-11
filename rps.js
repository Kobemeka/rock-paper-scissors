let rps_radius
let rps_vel
let rps_count = 5
let canvas_size = { x: 600, y: 600 }
let willUpdate = true
let rps_radius_slider
let rps_vel_slider
let game
let listOfValues = (n) => {
    return [].concat(...Array(n).fill([1, 2, 3]));
}
let distance = (a, b) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}
let isCollide = (a, b) => {
    return distance(a, b) <= rps_radius
}
let changeColor = (a, b) => {
    let dif = Math.abs(a - b)
    if (dif == 1) {
        return Math.max(a, b)
    }
    else if (dif == 2) {
        return 1
    }
    else {
        return a
    }

}

let getColor = (v) => {
    if (v == 1) {
        return [242, 63, 63]
    }
    else if (v == 2) {
        return [102, 242, 63]
    }
    else if (v == 3) {
        return [63, 129, 242]
    } else {

        return [255, 255, 255]
    }
}

let createGame = (n) => {
    let rpss = []
    for (let i = 0; i < n * 3; i++) {
        rpss.push(new rps(Math.random() * (canvas_size.x-100) + 50, Math.random() * (canvas_size.y-100) + 50, listOfValues(n)[i]))
    }
    return rpss
}
class rps {
    constructor(x, y, value) {
        this.x = x
        this.y = y
        this.value = value
        this.velocity = { x: Math.random(), y: Math.random() }
    }

    draw() {
        noStroke()
        fill(...getColor(this.value))
        ellipse(this.x, this.y, rps_radius)
        noFill()
    }
    change_direction(axis) {
        if (axis.includes("x")) {
            this.velocity.x *= -1
        }
        if (axis.includes("y")) {
            this.velocity.y *= -1
        }
    }
    walk() {

        if (this.x + rps_radius / 2 >= canvas_size.x || this.x - rps_radius / 2 <= 0) {
            this.change_direction(["x"])
        }
        if (this.y + rps_radius / 2 >= canvas_size.y || this.y - rps_radius / 2 <= 0) {
            this.change_direction(["y"])
        }

        this.x += this.velocity.x * rps_vel
        this.y += this.velocity.y * rps_vel
    }
    update() {
        this.walk()
        this.draw()
    }
}


function setup() {
    let canvas = createCanvas(canvas_size.x, canvas_size.y)
    canvas.parent("game")
    textSize(20);
    rps_radius_slider = createSlider(5, canvas_size.x/10,canvas_size.x/10)
    rps_radius_slider.position(0, 60)
    
    rps_vel_slider = createSlider(2, 10, 7)
    rps_vel_slider.position(150, 60)
    game = createGame(rps_count)
}



let current_time = 0
let times = []
let reds = []
let greens = []
let blues = []

let TESTER = document.getElementById('tester');

function draw() {
    background(55)
    fill(255)
    text("Radius", 20, 20)
    text("Velocity", 170, 20)

    rps_radius = rps_radius_slider.value()
    rps_vel = rps_vel_slider.value()
    red_count = 0
    green_count = 0
    blue_count = 0
    for (let i = 0; i < game.length; i++) {

        r0 = game[i]
        if (r0.value == 1) {
            red_count += 1
        }
        else if (r0.value == 2) {
            green_count += 1
        }
        else if (r0.value == 3) {
            blue_count += 1
        }
        for (let j = 0; j < game.length; j++) {
            r1 = game[j]
            if (i != j) {
                if (isCollide(r0, r1)) {
                    temp = r0.velocity
                    r0.velocity = r1.velocity
                    r1.velocity = temp

                    nw = changeColor(r0.value, r1.value)
                    r0.value = nw
                    r1.value = nw

                }
            }

        }
        if (willUpdate) {
            
            game[i].update()
        }else{
            game[i].draw()
            noLoop()

        }
    }
    reds.push(red_count)
    greens.push(green_count)
    blues.push(blue_count)

    times.push(current_time)
    current_time += 1 / 60
}
Plotly.newPlot("graph", [
    {
        y: reds,
        name: "red",
        line: {
            color: "rgb(242, 63, 63)"
        }
    },
    {
        y: greens,
        name: "green",
        line: {
            color: "rgb(102, 242, 63)"
        }
    },
    {
        y: blues,
        name: "blue",
        line: {
            color: "rgb(63, 129, 242)"
        }
    }
]);

var interval = setInterval(function () {
    let rgbc = [[reds[reds.length - 1]], [greens[greens.length - 1]], [blues[blues.length - 1]]]
    Plotly.extendTraces("graph", {
        y: rgbc
    }, [0, 1, 2])

    if (rgbc.map(x => {return x[0]}).includes(rps_count*3)) {
        clearInterval(interval)
        willUpdate = false
    }
}, 1000 / 60);