

type rgb = {
    [key:string]:number
}

export function getColor(value: number) {
    const maxStep = 255 * 3.5
    // const maxStep = 940
    const stepRatio = maxStep / 100
    let stepsToDo = value * stepRatio

    let rgb:rgb = {
        red: 255,
        green: 0,
        blue: 0,
    }

    let colorSequence = ['green', 'red', 'blue']
    let maxTries = 10

    while (stepsToDo > 0 && maxTries > 0) {
        maxTries = maxTries - 1
        colorSequence.forEach((v, i) => {
            let currentValue = rgb[v]
            let toAdjust = 255

            if (stepsToDo - toAdjust < 0) {
                toAdjust = stepsToDo

            }

            stepsToDo = stepsToDo - toAdjust

            if (currentValue >= 255) {
                rgb[v] = currentValue - toAdjust
                if (rgb[v] < 0) {
                    stepsToDo = stepsToDo - rgb[v]
                    rgb[v] = 0
                }

            } else {
                rgb[v] = toAdjust

                if (rgb[v] >= 255) {
                    stepsToDo = stepsToDo + (rgb[v] - 255)
                    rgb[v] = 255
                }

            }

        })

    }
    return `rgb(${rgb['red']}, ${rgb['green']}, ${rgb['blue']})`;
}

export function formatDateTime(date:Date){
    date = new Date(date)

    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    return formattedDate

}