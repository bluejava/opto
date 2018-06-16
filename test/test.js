const opto = require("../dist/opto.cjs.js")

section("Argument Handling", function() {

	// Options without values are set to "true"
	test("boolean options", function() {
			var options = opto({ args: ["-a","-b","-c"]})
			assert(options.a)
			assert(options.b)
			assert(options.c)
		})

	// Testing simple arguments - numbers are parsed to number values
	test("Single argument options", function() {
			var options = opto({ args: ["-a","10","-b","test","-c","-d","4.5"]})
			assert.equal(options.a,10)
			assert.equal(options.b,"test")
			assert(options.c)
			assert.equal(options.d,4.5)
		})

	// when multiple values are specified after an option, it becomes an array  of values
	test("Multi argument options", function() {
			var options = opto({ args: ["-a","10","-a", "20","-c", "-a", "30"]})
			assert.deepEqual(options["a.multi"], [10,20,30])
			assert.equal(options.a, 30)
			assert.equal(options.c, true)
		})

	// preceding an option name with -- is same as -
	test("double dash works too", function() {
			var options = opto({ args: ["--a","10","-b","test","--c"]})
			assert.equal(options.a,10)
			assert.equal(options.b,"test")
			assert(options.c)
		})

	// the string "true" and "false" are converted to their boolean types
	test("boolean conversion", function() {
			var options = opto({ args: ["-a","true","-b","false"]})
			assert.equal(options.a,true)
			assert.equal(options.b,false)
		})

	// When an option is specified twice, its value becomes an array
	test("Iterative building of option values", function() {
			var options = opto({ args: ["-a","10","-b","false","-a","20"]})
			assert.equal(options.a, 20)
			assert.equal(options.b, false)
			assert.deepEqual(options["a.multi"],[10,20])
		})

	//  values not preceded by an option go into the _ property
	test("optionless arguments", function() {
			var options = opto({ args: [ "-a", "50", "60", "test"]})
			console.log("options: ", options)
			assert.equal(options.a, 50)
			assert.equal(options._, "test")
			assert.deepEqual(options["_.multi"], [60, "test"])
		})


})
