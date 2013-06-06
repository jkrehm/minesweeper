define({
    defaults: {
        bombs: 0,
        difficulty: null,
        flags: 0,
        grid: null,
        infiniteLoop: 0,
        interval: null,
        size: 0,
        timer: 0
    },

    difficulties: {
        easy: {
            size: 8,
            bombs: 10
        },
        medium: {
            size: 16,
            bombs: 30
        },
        hard: {
            size: 32,
            bombs: 90
        }
    }
});