# Upgrade Notes

## From Ritocore 3.0.0 to 4.0.0

`ritocore-node@2.1.1` to `ritocore-node@3.0.0`

This major upgrade includes changes to indexes, API methods and services. Please review below details before upgrading.

### Indexes

Indexes include *more information* and are now also *faster*. Because of this a **reindex will be necessary** when upgrading as the address and database indexes are now a part of ritod with three new `rito.conf` options:
- `-addressindex`
- `-timestampindex`
- `-spentindex`

To start reindexing add `reindex=1` during the **first startup only**.

### Configuration Options

- The `rito.conf` file in will need to be updated to include additional indexes *(see below)*.
- The `datadir` option is now a part of `ritod` spawn configuration, and there is a new option to connect to multiple ritod processes (Please see [Ritocoin Service Docs](services/ritod.md) for more details). The services `db` and `address` are now a part of the `ritod` service. Here is how to update `ritocore-node.json` configuration options:

**Before**:
```json
{
  "datadir": "/home/<username>/.rito",
  "network": "livenet",
  "port": 3001,
  "services": [
    "address",
    "ritod",
    "db",
    "web"
  ]
}
```

**After**:
```json
{
  "network": "livenet",
  "port": 3001,
  "services": [
    "ritod",
    "web"
  ],
  "servicesConfig": {
    "ritod": {
      "spawn": {
        "datadir": "/home/<username>/.rito",
        "exec": "/home/<username>/ritocore-node/bin/ritod"
      }
    }
  }
}
```

It will also be necessary to update `rito.conf` settings, to include these fields:
```
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:<port>
zmqpubhashblock=tcp://127.0.0.1:<port>
rpcallowip=127.0.0.1
rpcuser=<user>
rpcpassword=<password>
```

**Important**: Once changes have been made you'll also need to add the `reindex=1` option **only for the first startup** to regenerate the indexes. Once this is complete you should be able to remove the `ritocore-node.db` directory with the old indexes.

### API and Service Changes
- Many API methods that were a part of the `db` and `address` services are now a part of the `ritod` service. Please see [Ritocoin Service Docs](services/ritod.md) for more details.
- The `db` and `address` services are deprecated, most of the functionality still exists. Any services that were extending indexes with the `db` service, will need to manage chain state itself, or build the indexes within `ritod`.
