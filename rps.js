let canvas_size = { x: 600, y: 600 }

let rps_radius
let rps_vel
let rps_count

let init_rps_radius = canvas_size.x / 20
let init_rps_vel = 7
let init_rps_count = 3 

let rps_radius_slider
let rps_vel_slider
let rps_count_slider

let game

let willUpdate = true
let run = false

let current_time = 0
let times = []
let reds = []
let greens = []
let blues = []

let isPlot = false

let listOfValues = (n) => {
    return [].concat(...Array(n).fill([1, 2, 3]));
}


let isCollide = (a, b) => {
    return (a.x - b.x) * (a.x - b.x)  + (a.y - b.y) * (a.y - b.y) <= rps_radius * rps_radius
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
    return [(v-1)*360/4,90,55]
}

let createGame = (n) => {
    let rpss = []
    for (let i = 0; i < n * 3; i++) {
        rpss.push(new rps(Math.random() * (canvas_size.x-100) + 50, Math.random() * (canvas_size.y-100) + 50, listOfValues(n)[i]))
    }
    return rpss
}

let plot = () => {

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
}
let createInterval = ()=>{

    var interval = setInterval(function () {
        if (run) {
            
            let rgbc = [[reds[reds.length - 1]], [greens[greens.length - 1]], [blues[blues.length - 1]]]
            Plotly.extendTraces("graph", {
                y: rgbc
            }, [0, 1, 2])
    
            if (rgbc.map(x => {return x[0]}).includes(rps_count*3)) {
                clearInterval(interval)
                willUpdate = false
                run = false
            }
        }
    
    }, 1000 / 60);
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

    walk() {
        ["x","y"].forEach(d=>{

            if (this[d] + rps_radius / 2 >= canvas_size[d] || this[d] - rps_radius / 2 <= 0) {
                this.velocity[d] *= -1
            }
        })

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

    colorMode(HSL)
    textSize(20)

    rps_radius_slider = createSlider(5, canvas_size.x/20, init_rps_radius)
    rps_radius_slider.position(0, 60)
    
    rps_vel_slider = createSlider(2, 20, init_rps_vel)
    rps_vel_slider.position(150, 60)
    
    rps_count_slider = createSlider(2, 10, init_rps_count)
    rps_count_slider.position(300, 60)
    rps_count = rps_count_slider.value()

    run_button = createButton("Run/Stop")
    run_button.position(450,60)
    run_button.mousePressed(()=>{run = !run})

    reset_button = createButton("Reset")
    reset_button.position(550,60)
    reset_button.mousePressed(()=>{
        time = 0
        times = []

        reds = []
        greens = []
        blues = []

        willUpdate = true
        game = createGame(rps_count)
        if (isPlot) {
            plot()
            createInterval()
        }
    })

    game = createGame(rps_count)
    
}



function draw() {
    background(4,0,34)
    
    fill(0,0,0)
    rps_radius = rps_radius_slider.value()
    rps_vel = rps_vel_slider.value()
    rps_count = rps_count_slider.value()

    text(`Radius: ${rps_radius}`, 20, 20)
    text(`Velocity: ${rps_vel}`, 170, 20)
    text(`Count: ${rps_count*3}`, 320, 20)
    text(`Run: ${run}`, 450, 20)
    color_values = []

    if (run) {
        

        for (let i = 0; i < game.length; i++) {
    
            r0 = game[i]
            if (isPlot) {
                color_values.push(r0.value)
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
                
                game[i].walk()
            }
        }
        if (isPlot) {
            
            reds.push(color_values.filter(x=>x==1).length)
            greens.push(color_values.filter(x=>x==2).length)
            blues.push(color_values.filter(x=>x==3).length)
        
            times.push(current_time)
            current_time += 1 / 60
        }
    }

    game.forEach((g) => {
        g.draw()
    });
    
    if (game.every( v => v.value == game[0].value )) {
        willUpdate = false
        run = false
    }

}
if (isPlot) {
    plot()
    createInterval()
}