// function to create sharable links randomly with length


export function random(len:  number): string{
    let options = "sn28ry2whksn9cwiqwfjewf9wuwfwef_eouwehw7afcbh"
    let length  = options.length

    let ans = ""

    for(let i = 0; i < len; i++){
        ans+= options[Math.floor(Math.random() * length)] 
    }

    return ans
}