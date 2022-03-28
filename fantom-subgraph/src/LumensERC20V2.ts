import { RebaseCall } from '../generated/LumensERC20V2/LumensERC20'
import { LuxorERC20 } from '../generated/LumensERC20V2/LuxorERC20'
import { Rebase } from '../generated/schema'
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import {LUX_ERC20_CONTRACT, STAKING_CONTRACT_V1} from './utils/Constants'
import { toDecimal } from './utils/Decimals'
import {getLUXUSDRate} from './utils/Price';

export function rebaseFunction(call: RebaseCall): void {
    let rebaseId = call.transaction.hash.toHex()
    var rebase = Rebase.load(rebaseId)
    log.debug("Rebase_V1 event on TX {} with amount {}", [rebaseId, toDecimal(call.inputs.profit_, 9).toString()])

    if (rebase == null && call.inputs.profit_.gt(BigInt.fromI32(0))) {
        let lux_contract = LuxorERC20.bind(Address.fromString(LUX_ERC20_CONTRACT))

        rebase = new Rebase(rebaseId)
        rebase.amount = toDecimal(call.inputs.profit_, 9)
        rebase.stakedLux = toDecimal(lux_contract.balanceOf(Address.fromString(STAKING_CONTRACT_V1)), 9)
        rebase.contract = STAKING_CONTRACT_V1
        rebase.percentage = rebase.amount.div(rebase.stakedLux)
        rebase.transaction = rebaseId
        rebase.timestamp = call.block.timestamp
        rebase.value = rebase.amount.times(getLUXUSDRate())
        rebase.save()
    }
}