export default function useBasicFunction() {

    const getRandomNum = (max: number) => {
        return Math.floor(Math.random() * max) + 1;
    }

    return {
        getRandomNum
    }
}