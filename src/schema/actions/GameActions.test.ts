import { _createHands } from "./GameActions";

describe("GameActions", () => {
    describe("_createHands", () => {
        it ("should take the last element index as center card", () => {
            const [centerCardIndex] = _createHands([1, 2, 69], []);

            expect(centerCardIndex).toEqual(69);
        });

        it ("should deal all cards to 1 player", () => {
            const [centerCardIndex, hands] = _createHands([5, 6, 69], ["foo"]);

            console.log(hands["foo"]);
            expect(Object.keys(hands).length).toEqual(1);
            expect(hands["foo"].cards).toEqual([5, 6]);
        })

        it ("should use all cards and deal even number of cards if possible", () => { 
            const [centerCardIndex, hands] = _createHands([45, 34, 23, 12, 56, 67, 69], ["foo", "bar"]);

            expect(Object.keys(hands).length).toEqual(2);
            expect(hands["foo"].cards).toEqual([45, 34, 23]);
            expect(hands["bar"].cards).toEqual([12, 56, 67]);            
        });

        it ("should deal same number of cards to all players with some left over if possible", () => { 
            const [centerCardIndex, hands] = _createHands([45, 34, 23, 12, 69], ["foo", "bar", "baz"]);

            expect(Object.keys(hands).length).toEqual(3);
            expect(hands["foo"].cards).toEqual([45]);
            expect(hands["bar"].cards).toEqual([34]);
            expect(hands["baz"].cards).toEqual([23]);           
        });

        it ("should deal remaining cards if majority will have extra cards if possible", () => { 
            const [centerCardIndex, hands] = _createHands([45, 34, 23, 12, 54, 69], ["foo", "bar", "baz"]);

            expect(Object.keys(hands).length).toEqual(3);
            expect(hands["foo"].cards).toEqual([45, 34]);
            expect(hands["bar"].cards).toEqual([23, 12]);
            expect(hands["baz"].cards).toEqual([54]);
            
        })

        it ("should deal remaining cards if half players will have extra cards", () => { 
            const [centerCardIndex, hands] = _createHands([45, 34, 23, 12, 54, 67, 69], ["foo", "bar", "baz", "bat"]);

            expect(Object.keys(hands).length).toEqual(4);
            expect(hands["foo"].cards).toEqual([45, 34]);
            expect(hands["bar"].cards).toEqual([23, 12]);
            expect(hands["baz"].cards).toEqual([54]);
            expect(hands["bat"].cards).toEqual([67]);
        })
    });
    
})