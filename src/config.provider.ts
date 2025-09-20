type ConfigType = { [k: string]: string | ConfigType };
export class ConfigProvider {
  private static _instance: ConfigProvider;
  private configFallback: ConfigType = {
    DB: {
      HOST: 'localhost',
      PORT: '5432',
      USER: 'postgres',
      PASSWORD: 'mysecretpassword',
      DATABASE: 'unp_segrega',
      SSL_ENABLE: 'false',
      RUN_MIGRATIONS: 'false',
    },
    LACCHAIN: {
      RPC_NODE: 'http://11.0.0.175:4545',
      NODE_ADDRESS: '0x211152ca21d5daedbcfbf61173886bbb1a217242',
      PRIVATE_KEY: '0x0dd81424cb66a9571df6d2785f29542c5954cde036cc7ea61d8aa302210ca809',
      CONTRACT_ADDRESS: '0xAF4b32E5CcA91392385C80F93AC972e54b09F7D2',
      CONTRACT_ABI:
        '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"string","name":"value","type":"string"}],"name":"ValueSeted","type":"event"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"retreive","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"newValueHash","type":"string"}],"name":"store","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
      // RPC_NODE: 'http://11.0.0.175:4545',
      // NODE_ADDRESS: '0x0000000000000000000000000000000000000000',
      // PRIVATE_KEY: '0x0000000000000000000000000000000000000000000000000000000000000000',
      // CONTRACT_ADDRESS: '0x0000000000000000000000000000000000000000',
      // CONTRACT_ABI: '[]',
    },
  };

  private constructor() {}

  static instance(): ConfigProvider {
    if (!ConfigProvider._instance) {
      ConfigProvider._instance = new ConfigProvider();
    }
    return ConfigProvider._instance;
  }

  getConfig(configConstant: string): string | null {
    configConstant = configConstant.replace(/^CNF__/g, '');
    return process.env['CNF__' + configConstant] ?? this.getFallbackConfig(configConstant);
  }

  getFallbackConfig(configConstant: string): string | null {
    configConstant = configConstant.replace(/^CNF__/g, '');
    const splittedCnf = configConstant.toUpperCase().split('__');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let res: any = this.configFallback;

    for (const k of splittedCnf) {
      if (res[k] !== undefined) res = res[k];
      else return null;
    }

    return typeof res === 'string' ? res : null;
  }
}
