export const convertFileToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result

            img.onload = () => {
                const canvas = document.createElement('canvas')
                const MAX_WIDTH = 800
                const MAX_HEIGHT = 800
                let width = img.width
                let height = img.height

                if (width > height && width > MAX_WIDTH) {
                    height *= MAX_WIDTH / height
                    width = MAX_WIDTH
                } else if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height
                    height = MAX_HEIGHT
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                const compressBase64 = canvas.toDataURL(file.type, 0.7)
                resolve(compressBase64)
            }
        }

        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}