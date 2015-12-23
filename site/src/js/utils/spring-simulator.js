$$.Simulation = $$.Simulation || {};

/**
 * Не нужно использовать этот класс напрямую. Нужно использовать $$.Simulation.Spring.
 */
$$.Simulation.SpringSimulator = function() {
	var self = this;

	this._springs = [];
	this._lastTime = +(new Date());

	setInterval(function() {
		var now = +(new Date());
		var time = (now - self._lastTime) / 1000;
		var dt = 0.01;

		if (time > 0.2) {
			// Если жс работает слишком медленно, замедлить симуляцию.
			time = 0.2;
		}

		var i, ni = self._springs.length, spring
			, dampings = []
			, distance, newDistance, force, newVelocity
			, targetVelocityLimit, velocityLimit, positionLimits;

		for (i = 0; i < ni; i++) {
			spring = self._springs[i];
			dampings.push(2 * Math.sqrt(spring._rigidness) * spring._damping);
		}

		while (time > 0.000001) {
			for (i = 0; i < ni; i++) {
				spring = self._springs[i];
				
				if (spring._frozen) {
					continue;
				}

				distance = spring._target - spring._position;

				force = (distance >= 0 ? 1 : -1) * Math.pow(Math.abs(distance), spring._forcePower) * spring._rigidness
					- (spring._velocity >= 0 ? 1 : -1) * Math.abs(spring._velocity) * dampings[i];

				newVelocity = spring._velocity + force * dt;

				velocityLimit = spring._velocityLimit;
				targetVelocityLimit = spring._targetVelocityLimit;

				if (targetVelocityLimit !== null) {
					targetVelocityLimit *= Math.pow(spring._targetVelocityLimitPower, Math.abs(distance));

					if (velocityLimit === null || targetVelocityLimit < velocityLimit) {
						velocityLimit = targetVelocityLimit;
					}
				}

				if (velocityLimit !== null && Math.abs(newVelocity) > velocityLimit) {
					newVelocity = (newVelocity >= 0 ? 1 : -1) * velocityLimit;
				}

				spring._position += newVelocity * dt;
				spring._velocity = newVelocity;

				if (spring._stopAtTarget) {
					newDistance = spring._target - spring._position;

					if (distance > 0 && newDistance <= 0 || distance < 0 && newDistance >= 0) {
						spring._position = spring._target;
						spring._velocity = 0;
						continue;
					}
				}

				if (spring._positionLimits !== null) {
					positionLimits = spring._positionLimits;

					if (spring._position < positionLimits[0]) {
						spring._position = positionLimits[0];
						spring._velocity = 0;
					} else if (spring._position > positionLimits[1]) {
						spring._position = positionLimits[1];
						spring._velocity = 0;
					}
				}
			}

			time -= dt;
		}

		self._lastTime = now;

		for (i = 0; i < ni; i++) {
			spring = self._springs[i];

			if (spring == null) {
				continue;
			}

			if (!spring._frozen && spring._step) {
				spring._step.call();
			}
		}
	}, 20);
};

$$.Simulation.SpringSimulator.prototype = {
	addSpring: function(spring) {
		this._springs.push(spring);
	},

	deleteSpring: function(spring) {
		var i = _.indexOf(this._springs, spring);

		if (i != -1) {
			this._springs.splice(i, 1);
		}
	}
};

// Создать один "глобальный" экземпляр.

$$.Simulation.__springSimulator = new $$.Simulation.SpringSimulator();
