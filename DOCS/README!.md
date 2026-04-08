Command registration in the current stable Bedrock scripting API is incomplete.
Many argument parsers and command features remain locked behind beta APIs, and some command-related actions cannot be reliably intercepted.

This addon was written with those limitations in mind.
Where possible, logic is structured so that it can take advantage of improved command support if and when it becomes available in the stable API. No guarantees are made that this will happen.

Hardcoded Behavior

Certain systems (notably hub protection) are hardcoded by design.
This addon was originally built for a private server with a fixed world layout and ruleset.

If you intend to use it elsewhere:

Expect to edit the scripts directly

Do not expect configuration files

Do not expect plug-and-play behavior

This is intentional.

—  Aethelgrad Studio