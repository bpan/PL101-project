var midiNumbers = {
	'a0': 21,
	'b0': 23,
	'c1': 24,
	'd1': 26,
	'e1': 28,
	'f1': 29,
	'g1': 31,
	'a1': 33,
	'b1': 32,
	'c2': 36,
	'd2': 38,
	'e2': 40,
	'f2': 41,
	'g2': 43,
	'a2': 45,
	'b2': 47,
	'c3': 48,
	'd3': 50,
	'e3': 52,
	'f3': 53,
	'g3': 55,
	'a3': 57,
	'b3': 59,
	'c4': 60,
	'd4': 62,
	'e4': 64,
	'f4': 65,
	'g4': 67,
	'a4': 69,
	'b4': 71,
	'c5': 72,
	'd5': 74,
	'e5': 76,
	'f5': 77,
	'g5': 79,
	'a5': 81,
	'b5': 83,
	'c6': 84,
	'd6': 86,
	'e6': 88,
	'f6': 89,
	'g6': 91,
	'a6': 93,
	'b6': 95,
	'c7': 96,
	'd7': 98,
	'e7': 100,
	'f7': 101,
	'g7': 103,
	'a7': 105,
	'b7': 107,
	'c8': 108
};

var convertPitch = function(noteName) {
	// 12 + 12 * octave + letterPitch. The letterPitch is 0 for C, 2 for D, up to 11 for B.
}

var endTime = function (time, expr) {
    var ret;
	switch(expr.tag)
	{
	case 'note':
	case 'rest':
        ret = time + expr.dur;
		break;
	case 'par':
        ret = time + Math.max(endTime(time, expr.left),
                              endTime(time, expr.right));
		break;
    case 'seq':
        ret = endTime(endTime(time, expr.left), expr.right);
		break;
    default:
		throw "Unsupported MUS tag";
	}
    return ret;
};

var convertMus = function(startTime, expr) {
    var ret;
	switch(expr.tag)
	{
    case 'note':
        ret = [{
            tag: 'note',
            pitch: midiNumbers[expr.pitch],
            start: startTime,
            dur: expr.dur
        }];
		break;
	case 'rest':
        ret = [{
            tag: 'rest',
            start: startTime,
            dur: expr.dur
        }];
		break;
    case 'par':
        ret = convertMus(startTime, expr.left).concat(convertMus(startTime, expr.right));
		break;
	case 'seq':
        ret = convertMus(startTime, expr.left).concat(convertMus(endTime(startTime, expr.left), expr.right));
		break;
	default:
		throw "Unsupported MUS tag";
    }
    return ret;
};

var compile = function (musexpr) {
    return convertMus(0, musexpr);
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'rest', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
