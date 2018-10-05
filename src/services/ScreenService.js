class ScreenService {

    isBiggerThan(size = 550, callback) {
        if (!callback) {
            return +window.innerWidth > size;
        }
        return window.addEventListener('resize', () => {
            callback(+window.innerWidth > size);
        })
    }
}

export default new ScreenService();
