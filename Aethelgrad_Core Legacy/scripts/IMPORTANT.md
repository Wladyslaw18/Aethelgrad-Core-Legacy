No disrespect is intended toward individual developers.
The technical issues described here are best explained by large-scale product management, corporate timelines, and the kind of decision-making that happens when software must satisfy millions of users and thousands of stakeholders — not by a lack of engineering ability.

Core Behavior Addon
API: 2.4.0 (Stable)
Minecraft: 1.21.130

“Stable” as in unchanged since it was already outdated.

What This Is

AethelgradCore is the foundational behavior addon for the Aethelgrad project.

It provides:

shared entities

shared logic

shared systems

It assumes the Bedrock addon API is:

documented,

versioned,

and behaves consistently.

That assumption is the first mistake.

Versions (Read This Carefully)

Let’s be absolutely clear, because Mojang isn’t.

Minecraft version: 1.21.130

Addon API version: 2.4.0 Stable

Addon API 2.5.0 Beta:
objectively stronger, cleaner, and less broken than “Stable”

Yes, the beta API works better than stable.
No, this is not a joke.

About the “Stable” Addon API (2.4.0)

Mojang labels API 2.4.0 as Stable.

What that actually means:

no crashes during certification,

no guarantees beyond that,

no forward planning.

“Stable” does not mean:

modern,

complete,

or competitive with its own beta.

It means:

“We stopped touching it.”

The Awkward Truth About 2.5.0 Beta

API 2.5.0 Beta:

has more features,

behaves more predictably,

fixes issues present in stable,

is easier to work with.

Which raises a question no one at Mojang answers:

Why is the beta API the production-ready one?

If this addon could target 2.5.0 without risk of sudden failure, it would.

But “beta” at Mojang means:

“works today”

“may vanish tomorrow”

So here we are.

Command Registry & Parser

(The Part That Breaks First)

The command registry system deserves its own section because it is consistently unreliable.

Observed behavior includes:

commands registering but not executing

arguments being ignored without error

commands working in one world and not another

silent failure with no logs

breaking across minor Minecraft updates

The parser is:

extremely sensitive to internal changes

poorly validated

weakly documented

If your command fails, the engine will not help you.
It will simply stop responding.

This is not a bug.
This is the design.

Components & Entity Behavior

The component system is powerful, but:

component semantics change between versions

some components “exist” but do nothing

some combinations are undocumented and unstable

invalid setups often fail silently

Entities rarely crash.

They just:

stop ticking,

stop responding,

or behave incorrectly with no indication why.

Which is worse than a crash.

Known Issues (aka Reality)

API 2.4.0 lacks features already present in 2.5.0 Beta

Commands may require restart(s) to behave

Some logic works only after world reload

Debug output is minimal or misleading

Updating Minecraft can break nothing, or everything

All of this is normal.

Development Notes

(Written After Several Regrets)

If you build on AethelgradCore:

Pin your Minecraft version.

Assume “Stable” means “legacy”.

Expect command logic to degrade over time.

Test after every update, no matter how small.

Keep workarounds documented — you will forget why they exist.

If something works flawlessly on first try:
double-check it. Something is wrong.

Installation

Install as a behavior pack.

Enable alone first.

Verify entities.

Verify commands.

Only then add other packs.

When it breaks, remove packs one by one and accept reality.

Versioning Philosophy

Versions reflect survival, not progress.

Patch versions exist because something broke.

Minor versions exist because Mojang moved a goalpost.

Major versions exist because the API changed without warning.

License

Use it.
Modify it.
Break it.

If it stops working:

check the Minecraft version,

check the API version,

then check the latest changelog Mojang didn’t write.

Final Note

AethelgradCore is built on API 2.4.0 Stable,
even though 2.5.0 Beta is better.

That sentence alone explains the state of Bedrock addon development.

If it works:
don’t update.

If it breaks:
you already know why.


Workarounds

(A Living Museum of Poor Decisions)

This section exists because the API does not.

Each workaround was added for a reason, even if that reason is no longer visible in the code.

1. Redundant Initialization Passes

Some systems are initialized more than once.

This is intentional.

Reason:

first pass sometimes doesn’t apply

second pass sometimes does

no error is thrown either way

Removing this will cause:

entities to load but not behave

commands to register but not function

complete silence from the engine

Do not “clean this up”.

2. Delayed Logic Binding

Certain logic is bound after a delay or secondary tick.

Why?

because binding during initial load is unreliable

because component state is not final when the API says it is

because Bedrock lies about readiness

If you move this logic earlier:

it will work on your machine

it will break on someone else’s

you will not know why

3. Defensive Component Duplication

Some components appear duplicated or oddly structured.

This compensates for:

components being ignored under specific conditions

undocumented internal validation rules

engine-side behavior changing between builds

Yes, it looks wrong.
No, removing it will not improve anything.

4. Command Registration Rituals

Commands are:

registered carefully,

validated indirectly,

and sometimes re-registered.

This is not paranoia.

The command registry/parser can:

accept invalid definitions without warning

reject valid ones silently

change behavior between Minecraft versions

If a command fails:

restart the world

restart the server

then assume it’s not your fault

Because it usually isn’t.

5. Version Guards That Look Useless

Some version checks appear redundant.

They exist because:

the same API version behaves differently across game builds

“stable” does not mean “consistent”

removing guards causes regression bugs weeks later

These are scars, not mistakes.

Fake Mojang Changelog

(Translated to Reality)

Official:

“Improved addon stability”

Actual meaning:

We fixed one crash and introduced three silent failures.

Official:

“Minor API adjustments”

Actual meaning:

Something changed, we’re not saying what, and your addon might stop working.

Official:

“Deprecated behavior updated”

Actual meaning:

The old way still works.
The new way works worse.
Pick your poison.

Official:

“Fixed an issue with commands”

Actual meaning:

Commands now break differently.

Official:

“Improved documentation”

Actual meaning:

We reworded the same paragraph and added no examples.

Official:

“No breaking changes”

Actual meaning:

We didn’t notice them.

Official:

“Beta features promoted to stable”

Actual meaning:

We removed half of them and renamed the rest.

Official:

“Internal refactors”

Actual meaning:

Everything still loads without errors, but behavior changed.

Frequently Asked Questions (Answered Honestly)

Q: Why not use API 2.5.0 Beta?
A: Because it’s better, and therefore cannot be trusted to remain.

Q: Why does this work on one version but not another?
A: Because Bedrock.

Q: Is this addon future-proof?
A: No Bedrock addon is future-proof. Some are just better prepared to suffer.

Q: Can I simplify this?
A: You can try.
You will undo workarounds you don’t understand and rediscover them later.

Final Warning

If you are reading this and thinking

“This seems overengineered”

Then you have not yet been broken by the Bedrock addon API.

You will be.

this is intentional
- Wladyslaw Kowalski