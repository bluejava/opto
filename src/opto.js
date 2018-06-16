const MULTI_EXT = ".multi",
	NO_SWITCH_ARGS_NAME = "_"

/**
 * Parses a string of arguments, generally from a command line.
 * If called with no options, this will grab command line arguments
 * from the process global object (node).
 *
 * If no value is given to a switch, it becomes true (boolean value).  To set as
 * boolean false, use "false" - i.e.  -c false.  Numbers are returned as numbers, not strings.
 * Multiple arguments of same name take last value, while all values go into array named
 * by appending .multi to the argument name. Arguments not preceded by a switch
 * go into the "_" argument (and multiples go into "_.multi"). Arguments with spaces
 * should be quoted with single or double quotes.
 *
 * ex:
 * 		node index -a -b -c 100 -d false -d hello --e "hello world" -b 3 -b foo bar "bing bang" boom
 *
 * returns the object:
 	{ a: true,
		b: 'foo',
		c: 100,
		d: 'hello',
		e: 'hello world',
		'b.multi': [ true, 3, 'foo' ],
		_: 'boom',
		'_.multi': [ 'bar', 'bing bang', 'boom' ] }
 *
 * @param {object} opts optional configuration
 */
function opto(conf)
{
	conf = conf || { }
	let args = conf.args

	// args is optional, default is process.argv
	if(!args)
	{
		args = process.argv.slice()
		args.shift() // shift out twice
		args.shift() // to remove the command itself
	}

	var opts = { }, curSwitch

	args.forEach(function(arg) {
			// its a switch
			if(/^(-|--)/.test(arg))
			{
				if(arg.startsWith("-")) arg = arg.substring(1)	// strip out leading -
				if(arg.startsWith("-")) arg = arg.substring(1) // 	or two

				if(opts[arg] !== undefined)	// if argument already specified, turn into array
				{
					if(!opts[arg + MULTI_EXT])
						opts[arg + MULTI_EXT] = [opts[arg]] // push current arg value to array
					opts[arg + MULTI_EXT].push(true)
				}

				opts[arg] = true	// default arg value to boolean true (will override if next arg is not a switch)

				curSwitch = arg
			}
			else
			{
				if(!curSwitch)
				{
					curSwitch = NO_SWITCH_ARGS_NAME
					if(opts[curSwitch] !== undefined)
					{
						if(!opts[curSwitch + MULTI_EXT])
							opts[curSwitch + MULTI_EXT] = [ opts[curSwitch] ]
						opts[curSwitch + MULTI_EXT].push(true) // give us something to override
					}
				}

				if(arg === "false")
					arg = false
				else
					if(arg === "true")
						arg = true
					else
						if(!isNaN(arg))
							arg = Number(arg)

				opts[curSwitch] = arg	// now that we have the arg value, set it

				if(opts[curSwitch + MULTI_EXT]) // if this is a multi-value, overwrite last one
				{
					opts[curSwitch + MULTI_EXT].length--
					opts[curSwitch + MULTI_EXT].push(arg)
				}

				curSwitch = null
			}
		})

	return opts
}

export default opto
