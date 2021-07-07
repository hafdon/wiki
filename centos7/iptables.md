Ben,

Your IT department should be able to help you with your iptables server firewall. The most important thing to remember is that the rules are processed in sequence. This means a rule permitting access must appear before a "drop all" rule. You can also use the /etc/hosts.allow and /etc/hosts.deny files to limit access. Set /etc/hosts.deny to ALL:ALL , specify what is allowed in /etc/hosts.allow .

-David
David Glass | Senior Systems Analyst | Information Services |        
Queen's University Belfast | University Road | Belfast | BT7 1NN |
Tel: +44 (0) 28 9097 6070 | Mob: 07754 441645 | Eml: d.glass@qub.ac.uk |
