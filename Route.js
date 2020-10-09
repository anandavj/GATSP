class Route {
    constructor(city) {
        this.city = city
        this.distance = 0
        this.fitness
    }

    calculateDistance() {
        let x = 0
        for (let i = 0; i < this.city.length-1; i++) {
            x += this.city[i].calculateDistance(this.city[i+1])
        }
        x += this.city[this.city.length-1].calculateDistance(this.city[0])
        this.distance = x
    }

    calculateFitness(val) {
        this.fitness = parseFloat(val/this.distance)
    }

    mutate(mutationRate) {
        // if(Math.random(1) < mutationRate) {
        //     _.shuffle(this.city)
        // }
        for (let i = 0; i < this.city.length; i++) {
            if(Math.random(1) < mutationRate) {
                let randomIndex = Math.floor(Math.random(this.city.length))
                let a = this.city[randomIndex]
                let b = this.city[i]
                this.city[i] = a
                this.city[randomIndex] = b
                // console.log("Gatcha")
            }
        }
    }
}