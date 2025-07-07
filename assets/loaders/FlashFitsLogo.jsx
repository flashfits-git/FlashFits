import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Text,
  Circle,
  Path,
  G,
  Ellipse,
  Rect,
} from 'react-native-svg';

const FlashFitsLogo = ({ width = 300, height = 100 }) => {
  const aspectRatio = 300 / 100;
  const calculatedHeight = width / aspectRatio;
  const finalHeight = height || calculatedHeight;

  return (
    <View style={[styles.container, { width, height: finalHeight }]}>
      <Svg width={width} height={finalHeight} viewBox="0 0 300 100">
        <Defs>
          {/* Gradient for 3D effect */}
          <LinearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4a4a4a" />
            <Stop offset="50%" stopColor="#2a2a2a" />
            <Stop offset="100%" stopColor="#1a1a1a" />
          </LinearGradient>
          
          {/* Gradient for depth/shadow */}
          <LinearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#0a0a0a" />
            <Stop offset="100%" stopColor="#000000" />
          </LinearGradient>
          
          {/* Stopwatch gradient */}
          <LinearGradient id="stopwatchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#e8e8e8" />
            <Stop offset="50%" stopColor="#cccccc" />
            <Stop offset="100%" stopColor="#999999" />
          </LinearGradient>
        </Defs>

        {/* Shadow/Depth layers for 3D effect */}
        <G transform="translate(3, 3)">
          {/* F shadow */}
          <Path
            d="M 5 20 L 5 75 L 15 75 L 15 50 L 25 50 L 25 40 L 15 40 L 15 30 L 30 30 L 30 20 Z"
            fill="url(#shadowGradient)"
          />
          
          {/* l shadow */}
          <Path
            d="M 35 20 L 35 75 L 45 75 L 45 20 Z"
            fill="url(#shadowGradient)"
          />
          
          {/* a shadow */}
          <Path
            d="M 50 35 Q 50 25 60 25 Q 70 25 70 35 L 70 75 L 60 75 L 60 55 L 55 55 L 55 75 L 50 75 Z M 55 45 L 60 45 Q 65 45 65 40 Q 65 35 60 35 Q 55 35 55 40 Z"
            fill="url(#shadowGradient)"
          />
          
          {/* s shadow */}
          <Path
            d="M 75 35 Q 75 25 85 25 Q 95 25 95 35 Q 95 45 85 45 Q 80 45 80 50 Q 80 55 85 55 Q 95 55 95 65 Q 95 75 85 75 Q 75 75 75 65 L 80 65 Q 80 70 85 70 Q 90 70 90 65 Q 90 60 85 60 Q 75 60 75 50 Q 75 40 85 40 Q 90 40 90 35 Q 90 30 85 30 Q 80 30 80 35 Z"
            fill="url(#shadowGradient)"
          />
          
          {/* h shadow */}
          <Path
            d="M 100 20 L 100 75 L 110 75 L 110 50 L 120 50 L 120 75 L 130 75 L 130 35 Q 130 25 120 25 Q 110 25 110 35 L 110 40 L 100 40 Z"
            fill="url(#shadowGradient)"
          />
          
          {/* F shadow */}
          <Path
            d="M 160 20 L 160 75 L 170 75 L 170 50 L 180 50 L 180 40 L 170 40 L 170 30 L 185 30 L 185 20 Z"
            fill="url(#shadowGradient)"
          />
          
          {/* i shadow */}
          <Path
            d="M 190 30 L 190 75 L 200 75 L 200 30 Z M 190 20 L 200 20 L 200 25 L 190 25 Z"
            fill="url(#shadowGradient)"
          />
          
          {/* t shadow */}
          <Path
            d="M 205 30 L 225 30 L 225 40 L 220 40 L 220 65 Q 220 75 225 75 L 230 75 L 230 65 L 225 65 L 225 40 L 230 40 L 230 30 L 235 30 L 235 20 L 205 20 Z"
            fill="url(#shadowGradient)"
          />
          
          {/* s shadow */}
          <Path
            d="M 240 35 Q 240 25 250 25 Q 260 25 260 35 Q 260 45 250 45 Q 245 45 245 50 Q 245 55 250 55 Q 260 55 260 65 Q 260 75 250 75 Q 240 75 240 65 L 245 65 Q 245 70 250 70 Q 255 70 255 65 Q 255 60 250 60 Q 240 60 240 50 Q 240 40 250 40 Q 255 40 255 35 Q 255 30 250 30 Q 245 30 245 35 Z"
            fill="url(#shadowGradient)"
          />
        </G>

        {/* Main text */}
        <G>
          {/* F */}
          <Path
            d="M 2 17 L 2 72 L 12 72 L 12 47 L 22 47 L 22 37 L 12 37 L 12 27 L 27 27 L 27 17 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
          
          {/* l */}
          <Path
            d="M 32 17 L 32 72 L 42 72 L 42 17 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
          
          {/* a */}
          <Path
            d="M 47 32 Q 47 22 57 22 Q 67 22 67 32 L 67 72 L 57 72 L 57 52 L 52 52 L 52 72 L 47 72 Z M 52 42 L 57 42 Q 62 42 62 37 Q 62 32 57 32 Q 52 32 52 37 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
          
          {/* s */}
          <Path
            d="M 72 32 Q 72 22 82 22 Q 92 22 92 32 Q 92 42 82 42 Q 77 42 77 47 Q 77 52 82 52 Q 92 52 92 62 Q 92 72 82 72 Q 72 72 72 62 L 77 62 Q 77 67 82 67 Q 87 67 87 62 Q 87 57 82 57 Q 72 57 72 47 Q 72 37 82 37 Q 87 37 87 32 Q 87 27 82 27 Q 77 27 77 32 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
          
          {/* h */}
          <Path
            d="M 97 17 L 97 72 L 107 72 L 107 47 L 117 47 L 117 72 L 127 72 L 127 32 Q 127 22 117 22 Q 107 22 107 32 L 107 37 L 97 37 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
          
          {/* Stopwatch integrated into the design */}
          <G transform="translate(135, 25)">
            {/* Stopwatch body */}
            <Circle
              cx="15"
              cy="20"
              r="18"
              fill="url(#stopwatchGradient)"
              stroke="#666"
              strokeWidth="2"
            />
            
            {/* Stopwatch button */}
            <Circle
              cx="15"
              cy="5"
              r="3"
              fill="#999"
              stroke="#666"
              strokeWidth="1"
            />
            
            {/* Stopwatch crown */}
            <Rect
              x="13"
              y="2"
              width="4"
              height="6"
              fill="#999"
              stroke="#666"
              strokeWidth="1"
            />
            
            {/* Stopwatch face */}
            <Circle
              cx="15"
              cy="20"
              r="14"
              fill="#f5f5f5"
              stroke="#ccc"
              strokeWidth="1"
            />
            
            {/* Clock hands */}
            <Path
              d="M 15 20 L 15 12"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M 15 20 L 22 20"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Center dot */}
            <Circle
              cx="15"
              cy="20"
              r="2"
              fill="#333"
            />
          </G>
          
          {/* F */}
          <Path
            d="M 157 17 L 157 72 L 167 72 L 167 47 L 177 47 L 177 37 L 167 37 L 167 27 L 182 27 L 182 17 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
          
          {/* i */}
          <Path
            d="M 187 27 L 187 72 L 197 72 L 197 27 Z M 187 17 L 197 17 L 197 22 L 187 22 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
          
          {/* t */}
          <Path
            d="M 202 27 L 222 27 L 222 37 L 217 37 L 217 62 Q 217 72 222 72 L 227 72 L 227 62 L 222 62 L 222 37 L 227 37 L 227 27 L 232 27 L 232 17 L 202 17 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
          
          {/* s */}
          <Path
            d="M 237 32 Q 237 22 247 22 Q 257 22 257 32 Q 257 42 247 42 Q 242 42 242 47 Q 242 52 247 52 Q 257 52 257 62 Q 257 72 247 72 Q 237 72 237 62 L 242 62 Q 242 67 247 67 Q 252 67 252 62 Q 252 57 247 57 Q 237 57 237 47 Q 237 37 247 37 Q 252 37 252 32 Q 252 27 247 27 Q 242 27 242 32 Z"
            fill="url(#textGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FlashFitsLogo;