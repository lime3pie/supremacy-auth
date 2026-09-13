**Damage distribution**

This explains how you can determine how much damage is received by different unit types in an army. You have to take their damage area into account.

Damage area values:
Heroes / Trench: 0.4
Inf: 0.5
Cav / Transports: 0.75
Rest: 1.0

Calculation example: lets say you have 50 Inf (damage area of 0.5), 10 Cav (damage area 0.75) and 10 AC (damage area 1.0) in a stack. They get damaged by 200 damage.

First you calculate how much of those 200 damage goes to each unit type, lets call them A, B and C for now. So for A you would calculate:
amount A * damageArea A / (amount A * damageArea A + amount B * damageArea B + amount C * damageArea C)

With actual values:

For the Inf: 50 * 0.5 / (50 * 0.5 + 10 * 0.75 + 10 * 1.0) =  59%
For the Cav: 10 * 0.75 / (50 * 0.5 + 10 * 0.75 + 10 * 1.0) = 17%
For the AC:  10 * 1.0 / (50 * 0.5 + 10 * 0.75 + 10 * 1.0) = 24%

Inf will receive 0.59 * 200 = 118 damage, 
Cav will receive 0.17 * 200 = 34 damage,
ACs will receive = 46 damage.

I rounded the values here so it is easy to read, there would be some half damage points applied to get to 200 damage in total.

Now you calculate how many units would die. Check how many times the incoming damage per type exceeds the average hitpoints of the type and kill as many. The rest of the damage is split among the survivors. Let's say all of them have full hitpoints currently, then:

Each Inf has 20 avg. HP, so 118 damage kill 5 Inf, the remaining 45 Inf receive 18 damage, so 2.5 damage per Inf.
Each Cav has 25 avg. HP, so 34 damage kills 1 Cav, the remaining 9 Cav receive 9 damage, so 1 damage per Cav.
Each AC has 60 avg. HP, so 45 damage kills no AC, the 10 AC take 45 damage, so 4.5 damage per AC.

For multiple armies that are attacked in the same location the calculation works in the same way, the amount of damage each unit gets are calculated as if it was one big stack.



There is a +/-10% RNG factor to combat. Meaning units may do a tad more or less dmg then their displayed dmg each attack. 
Which needs to be an option to toggle if it should count the RNG