$$.Simulation = $$.Simulation || {};

/**
 * @constructor
 */
$$.Simulation.Spring = function (options) {
	options = _.extend({
		frozen:                   false,
		position:                 0,
		positionLimits:           null,
		target:                   0,
		targetLimits:             null,
		velocity:                 0,
		velocityLimit:            null,
		rigidness:                1,
		damping:                  1,
		forcePower:               1,
		targetVelocityLimit:      null,
		targetVelocityLimitPower: 1.25,
		stopAtTarget:             false,
		step:                     null
	}, options || {});

	this._frozen = options.frozen;
	this._position = options.position;
	this._positionLimits = options.positionLimits;
	this._target = options.target;
	this._targetLimits = options.targetLimits;
	this._velocity = options.velocity;
	this._velocityLimit = options.velocityLimit;
	this._rigidness = options.rigidness;
	this._damping = options.damping;
	this._forcePower = options.forcePower;
	this._targetVelocityLimit = options.targetVelocityLimit;
	this._targetVelocityLimitPower = options.targetVelocityLimitPower;
	this._stopAtTarget = options.stopAtTarget;
	this._step = null;

	if (options.step) {
		this.step(options.step);
	}

	this._applyTargetLimits();

	$$.Simulation.__springSimulator.addSpring(this);
};

$$.Simulation.Spring.prototype = {
	_applyTargetLimits: function () {
		if (this._targetLimits === null) {
			return;
		}

		if (this._target < this._targetLimits[ 0 ]) {
			this._target = this._targetLimits[ 0 ];
		} else if (this._target > this._targetLimits[ 1 ]) {
			this._target = this._targetLimits[ 1 ];
		}
	},

	destroy: function () {
		this._step = null;
		$$.Simulation.__springSimulator.deleteSpring(this);
	},

	moveTarget: function (delta) {
		this._target += delta;
		this._applyTargetLimits();
	},

	step: function (callback) {
		this._step = _.bind(callback, this);
	},

	target: function (value) {
		if (arguments.length == 0) {
			return this._target;
		}

		this._target = value;
		this._applyTargetLimits();
	},

	targetLimits: function (value) {
		if (arguments.length == 0) {
			return this._targetLimits;
		}

		this._targetLimits = value;
		this._applyTargetLimits();
	}
};

// Создать методы-аксессоры.

_.each([
	'frozen', 'position', 'positionLimits', 'velocity', 'velocityLimit'
	, 'rigidness', 'damping', 'forcePower',
	, 'targetVelocityLimit', 'targetVelocityLimitPower', 'stopAtTarget'
], function (k) {
	$$.Simulation.Spring.prototype[ k ] = function (value) {
		if (arguments.length == 0) {
			return this[ '_' + k ];
		}

		this[ '_' + k ] = value;
	};
});
