

<!-- toc -->

- [AWRI Chat Applikation auf Openshift!](#awri-chat-on-openshift)
  * [Anleitung](#anleitung)
    + [Chat Funktionen](#chat-funktionen)
    + [Beispiele](#beispiele)

<!-- tocstop -->

## AWRI Chat Applikation auf Openshift!
-----------------

This example will serve a welcome page and the current hit count as stored in a database.

### Anleitung

There are four methods to get started with OpenShift v3:

  - Starten mit MONGO_URL=mongodb://127.0.0.1:27017 npm start
  - Openshift DATABASE_SERVICE_NAME muss gesetzt sein auf Openshift!
  - ...

#### Chat Funktionen

One option is to use the Vagrant all-in-one launch as described in the [OpenShift Origin All-In-One Virtual Machine](https://www.openshift.org/vm/). This option works on Mac, Windows and Linux, but requires that you install [Vagrant](https://www.vagrantup.com/downloads.html) running [VirtualBox](https://www.virtualbox.org/wiki/Downloads).

#### Beispiele

Another option to run virtual machine but not having to using Vagrant is to download and use the `minishift` binary as described in its [getting started](https://github.com/minishift/minishift/#getting-started) section. `minishift` can be used to spin up a VM on any of Windows, Linux or Mac with the help of supported underlying virtualization technologies like KVM, xhyve, Hyper-V, VirtualBox.


        $ git clone https://github.com/hyp1/nodejs-ex

Looking at the repo, you'll notice three files in the openshift/template directory:

	nodejs-ex
	├ ── openshift
	│   └── templates
	│       ├── nodejs.json
	│       ├── nodejs-mongodb.json
	│       └── 
       