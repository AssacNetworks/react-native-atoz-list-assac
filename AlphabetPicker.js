import React, { Component } from 'react';
import { View, Text, PanResponder ,StyleSheet,PixelRatio} from 'react-native';
import PropTypes from 'prop-types';

class LetterPicker extends Component {

    render() {
        return (
            <View>
                <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
                    {this.props.letter}
                </Text>
            </View>
        );
    }
}

const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
export default class AlphabetPicker extends Component {
    constructor(props, context) {
        super(props, context);
        if(props.alphabet){
            let len = props.alphabet.length
            let b = 1;
            for(let index =1; index < len; index++) {
                props.alphabet.splice(b,0," •")
                b = b +2;
            }
            Alphabet = props.alphabet;
        }
        this.state = {
            alphabet: Alphabet
          };
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gestureState) => {
                this.props.onTouchStart && this.props.onTouchStart();

                this.tapTimeout = setTimeout(() => {
                    this._onTouchLetter(this._findTouchedLetter(gestureState.y0));
                }, 100);
            },
            onPanResponderMove: (evt, gestureState) => {
                clearTimeout(this.tapTimeout);
                // alert(gestureState.moveY)
                this._onTouchLetter(this._findTouchedLetter(gestureState.moveY));
            },
            onPanResponderTerminate: this._onPanResponderEnd.bind(this),
            onPanResponderRelease: this._onPanResponderEnd.bind(this),
        });
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.alphabet !== nextProps.alphabet){
            this.setState({alphabet:nextProps.alphabet})
          }
      }

    _onTouchLetter(letter) {
        letter && this.props.onTouchLetter && this.props.onTouchLetter(letter);
    }

    _onPanResponderEnd() {
        requestAnimationFrame(() => {
            this.props.changeBubble();
            this.props.onTouchEnd && this.props.onTouchEnd();
        });
    }

    _findTouchedLetter(y) {
        let top = y - (this.absContainerTop || 0);
        const {alphabet} = this.state
        

        if (top >= 2 && top <= this.containerHeight -2) {
            this.props.changeTop(this.y + top)
            return alphabet[Math.round((top / this.containerHeight) * alphabet.length)] == " •" ? alphabet[Math.round((top / this.containerHeight) * alphabet.length) - 1] : alphabet[Math.round((top / this.containerHeight) * alphabet.length)]
        }
    }

    _onLayout(nativeEvent) {
        this.refs.alphabetContainer.measure((x, y, width, height, px, py) => {
            this.absContainerTop = py;
            this.containerHeight = height;
            this.y = nativeEvent.layout.y;
        });
    }

    render() {
        const {alphabet} = this.state
        this._letters = (
            alphabet.map((letter) => <LetterPicker letter={letter} key={letter} />)
        );

        return (
            <View
                ref='alphabetContainer'
                {...this._panResponder.panHandlers}
                onLayout={({nativeEvent}) => (this._onLayout(nativeEvent))}
                style={{ paddingHorizontal: 5, backgroundColor: '#fff', borderRadius: 1, justifyContent: 'center' }}>
                <View>
                    {this._letters}
                </View>
            </View>
        );
    }

}